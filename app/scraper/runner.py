"""Background scraper using Playwright + DuckDuckGo HTML search."""
from __future__ import annotations

import asyncio
import hashlib
import logging
from datetime import datetime
from urllib.parse import quote_plus, urlparse

from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from ..database import Listing, SessionLocal
from .classify import classify_eur_per_watt
from .parser import (
    parse_condition,
    parse_price_to_eur,
    parse_quantity,
    parse_watt_per_panel,
)
from .sources import COUNTRY_QUERIES, EXCLUDED_DOMAINS

log = logging.getLogger("scraper")

SEARCH_URL = "https://html.duckduckgo.com/html/?q={q}"
MAX_RESULTS_PER_QUERY = 12


def _hash_url(url: str) -> str:
    return hashlib.sha256(url.encode("utf-8")).hexdigest()


def _is_excluded(url: str) -> bool:
    try:
        host = urlparse(url).netloc.lower()
    except Exception:
        return True
    if not host:
        return True
    return any(bad in host for bad in EXCLUDED_DOMAINS)


async def _search_duckduckgo(page, query: str) -> list[tuple[str, str, str]]:
    """Return list of (url, title, snippet) tuples."""
    await page.goto(SEARCH_URL.format(q=quote_plus(query)), timeout=30_000, wait_until="domcontentloaded")
    html = await page.content()
    soup = BeautifulSoup(html, "html.parser")
    out: list[tuple[str, str, str]] = []
    for result in soup.select("div.result")[:MAX_RESULTS_PER_QUERY]:
        a = result.select_one("a.result__a")
        snip = result.select_one(".result__snippet")
        if not a or not a.get("href"):
            continue
        url = a["href"]
        title = a.get_text(" ", strip=True)
        snippet = snip.get_text(" ", strip=True) if snip else ""
        if _is_excluded(url):
            continue
        out.append((url, title, snippet))
    return out


def _build_listing(country: str, url: str, title: str, snippet: str) -> dict | None:
    text = f"{title}\n{snippet}"
    price = parse_price_to_eur(text)
    watt = parse_watt_per_panel(text)
    qty = parse_quantity(text)
    eur_per_watt = None
    if price and watt and qty:
        total_w = watt * qty
        if total_w > 0:
            eur_per_watt = round(price / total_w, 4)
    classification = classify_eur_per_watt(eur_per_watt)
    host = urlparse(url).netloc.lower()
    return {
        "url_hash": _hash_url(url),
        "country": country,
        "source_website": host,
        "listing_url": url,
        "title": title[:500],
        "price_eur": price,
        "quantity": qty,
        "watt_per_panel": watt,
        "eur_per_watt": eur_per_watt,
        "classification": classification,
        "condition": parse_condition(text),
    }


def _upsert(session: Session, data: dict) -> None:
    existing = session.query(Listing).filter_by(url_hash=data["url_hash"]).one_or_none()
    now = datetime.utcnow()
    if existing is None:
        session.add(Listing(**data, first_seen=now, last_seen=now))
        return
    if data["price_eur"] is not None and existing.price_eur != data["price_eur"]:
        existing.previous_price_eur = existing.price_eur
        existing.price_eur = data["price_eur"]
        existing.eur_per_watt = data["eur_per_watt"]
        existing.classification = data["classification"]
    existing.title = data["title"]
    existing.quantity = data["quantity"] or existing.quantity
    existing.watt_per_panel = data["watt_per_panel"] or existing.watt_per_panel
    existing.condition = data["condition"] or existing.condition
    existing.last_seen = now


async def _scrape_async() -> dict:
    from playwright.async_api import async_playwright

    new_count = 0
    updated = 0
    total = 0
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            locale="en-US",
        )
        page = await context.new_page()

        session = SessionLocal()
        try:
            for country, queries in COUNTRY_QUERIES.items():
                for q in queries:
                    try:
                        results = await _search_duckduckgo(page, q)
                    except Exception as exc:  # noqa: BLE001
                        log.warning("search failed for %s: %s", q, exc)
                        continue
                    for url, title, snippet in results:
                        listing = _build_listing(country, url, title, snippet)
                        if not listing:
                            continue
                        before = session.query(Listing).filter_by(url_hash=listing["url_hash"]).one_or_none()
                        _upsert(session, listing)
                        total += 1
                        if before is None:
                            new_count += 1
                        else:
                            updated += 1
                    await asyncio.sleep(1.0)
            session.commit()
        finally:
            session.close()
            await context.close()
            await browser.close()
    return {"total": total, "new": new_count, "updated": updated}


def run_scrape() -> dict:
    """Synchronous entry point used by APScheduler and the API."""
    log.info("Starting scrape run")
    try:
        result = asyncio.run(_scrape_async())
        log.info("Scrape finished: %s", result)
        return result
    except Exception as exc:  # noqa: BLE001
        log.exception("Scrape failed: %s", exc)
        return {"error": str(exc)}
