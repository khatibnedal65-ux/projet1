"""Helpers to parse listing text into structured fields."""
from __future__ import annotations

import re

PRICE_RE = re.compile(
    r"(?P<value>\d{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?)\s*(?P<cur>€|eur|euro|chf|gbp|£|kr|sek|nok|dkk)",
    re.IGNORECASE,
)
WATT_RE = re.compile(r"(\d{2,4})\s*(?:w|wp|watt)\b", re.IGNORECASE)
QTY_RE = re.compile(
    r"(?:(\d{1,5})\s*(?:x|×|stk|stück|pcs|pieces|pieza|pezzi|panneaux|panels|panele|moduli|modules|module|stuks|paneles|painéis|stk\.?))",
    re.IGNORECASE,
)
PALLET_RE = re.compile(r"(\d{1,3})\s*(?:pallet|palette|palett|palettes|paletten|pallets)", re.IGNORECASE)

# Approx FX rates to EUR (static fallback; refresh manually if needed).
FX_TO_EUR = {
    "€": 1.0,
    "eur": 1.0,
    "euro": 1.0,
    "chf": 1.05,
    "gbp": 1.17,
    "£": 1.17,
    "kr": 0.087,  # default to SEK; close enough as fallback
    "sek": 0.087,
    "nok": 0.085,
    "dkk": 0.134,
}


def _to_float(raw: str) -> float | None:
    raw = raw.strip().replace(" ", "")
    if "," in raw and "." in raw:
        # assume "." thousands, "," decimal (European)
        raw = raw.replace(".", "").replace(",", ".")
    elif "," in raw:
        # if 2 digits after comma -> decimal
        if re.search(r",\d{1,2}$", raw):
            raw = raw.replace(".", "").replace(",", ".")
        else:
            raw = raw.replace(",", "")
    try:
        return float(raw)
    except ValueError:
        return None


def parse_price_to_eur(text: str) -> float | None:
    if not text:
        return None
    m = PRICE_RE.search(text)
    if not m:
        return None
    value = _to_float(m.group("value"))
    if value is None:
        return None
    cur = m.group("cur").lower()
    rate = FX_TO_EUR.get(cur, 1.0)
    return round(value * rate, 2)


def parse_watt_per_panel(text: str) -> int | None:
    if not text:
        return None
    candidates = [int(m.group(1)) for m in WATT_RE.finditer(text)]
    candidates = [c for c in candidates if 50 <= c <= 800]
    if not candidates:
        return None
    return max(candidates)


def parse_quantity(text: str) -> int:
    if not text:
        return 1
    pallet = PALLET_RE.search(text)
    if pallet:
        try:
            n = int(pallet.group(1))
            return max(1, n * 36)  # ~36 panels per pallet typical
        except ValueError:
            pass
    m = QTY_RE.search(text)
    if m:
        try:
            n = int(m.group(1))
            if 1 <= n <= 50000:
                return n
        except ValueError:
            pass
    return 1


def parse_condition(text: str) -> str:
    if not text:
        return "unknown"
    low = text.lower()
    if any(k in low for k in ("used", "occasion", "gebraucht", "usato", "usado", "begagnad", "tweedehands")):
        return "used"
    if any(k in low for k in ("new", "neu", "neuf", "nuovo", "nuevo", "novo", "ny ")):
        return "new"
    if any(k in low for k in ("surplus", "restposten", "déstockage", "stock", "liquidation")):
        return "surplus"
    if any(k in low for k in ("pallet", "palette", "palett")):
        return "pallet"
    return "unknown"
