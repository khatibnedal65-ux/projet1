from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from pathlib import Path
from threading import Thread

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import FastAPI, Query, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from .database import Listing, SessionLocal, init_db
from .i18n import CLASSIFICATION_AR, CLASSIFICATION_COLOR, COUNTRY_AR
from .scraper import run_scrape

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
log = logging.getLogger("app")

BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

scheduler = BackgroundScheduler(timezone="UTC")


def _scheduled_scrape() -> None:
    log.info("Daily scheduled scrape triggered")
    run_scrape()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    scheduler.add_job(
        _scheduled_scrape,
        trigger=CronTrigger(hour=3, minute=0),
        id="daily_scrape",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    scheduler.start()
    log.info("Scheduler started; daily scrape at 03:00 UTC")
    try:
        yield
    finally:
        scheduler.shutdown(wait=False)


app = FastAPI(title="Solar Deals Europe Monitor", lifespan=lifespan)


@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "countries": COUNTRY_AR,
        },
    )


@app.get("/api/listings")
def api_listings(country: str = Query("all")):
    session = SessionLocal()
    try:
        q = session.query(Listing)
        if country and country != "all":
            q = q.filter(Listing.country == country)
        q = q.order_by(Listing.eur_per_watt.is_(None), Listing.eur_per_watt.asc(), Listing.last_seen.desc())
        rows = q.limit(500).all()
        items = []
        for r in rows:
            items.append(
                {
                    "id": r.id,
                    "country": r.country,
                    "country_ar": COUNTRY_AR.get(r.country, r.country),
                    "title": r.title,
                    "source_website": r.source_website,
                    "listing_url": r.listing_url,
                    "price_eur": r.price_eur,
                    "previous_price_eur": r.previous_price_eur,
                    "quantity": r.quantity,
                    "watt_per_panel": r.watt_per_panel,
                    "eur_per_watt": r.eur_per_watt,
                    "classification": r.classification,
                    "classification_ar": CLASSIFICATION_AR.get(r.classification or "", "—"),
                    "classification_color": CLASSIFICATION_COLOR.get(r.classification or "", "bg-gray-400"),
                    "condition": r.condition,
                    "last_seen": r.last_seen.isoformat() if r.last_seen else None,
                }
            )
        return {"count": len(items), "items": items}
    finally:
        session.close()


_scrape_thread: Thread | None = None


@app.post("/api/scrape")
def api_scrape():
    global _scrape_thread
    if _scrape_thread is not None and _scrape_thread.is_alive():
        return JSONResponse({"status": "already_running"}, status_code=202)

    def _worker():
        run_scrape()

    _scrape_thread = Thread(target=_worker, daemon=True)
    _scrape_thread.start()
    return {"status": "started"}


@app.get("/api/scrape/status")
def api_scrape_status():
    running = _scrape_thread is not None and _scrape_thread.is_alive()
    return {"running": running}
