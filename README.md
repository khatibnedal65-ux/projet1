# solar-deals-europe-monitor

Automated daily monitoring of European solar panel deals (used / new / surplus / pallets / bulk).
Background scraper feeds a SQLite DB; a FastAPI + Tailwind dashboard (Arabic RTL UI) shows the listings.

## Features
- Background daily scrape via APScheduler (03:00 UTC).
- Playwright + BeautifulSoup search across DE/FR/IT/ES/PT/NL/BE/CH/SE/NO/DK in native languages.
- Facebook (and related domains) excluded entirely.
- Extracts country, source, URL, title, price (EUR), quantity, watt/panel, condition; computes €/W.
- Classification: `excellent_plus` (<0.05), `excellent` (<0.07), `good` (<0.10), `average` (<0.13), `expensive` (≥0.13).
- SQLite + SHA-256 URL hash for de-duplication; tracks `previous_price_eur` on changes.
- Single-page Arabic RTL dashboard with country filter, refresh, and "force scrape now".

## Install

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
```

## Run

```bash
uvicorn app.main:app --reload
```

Open http://localhost:8000

The first time, click **"تشغيل المسح الآن"** (Force Scrape Now) to populate the table — afterwards
the daily job runs automatically in the background.

## Project layout
```
app/
  main.py                # FastAPI app + APScheduler
  i18n.py                # Arabic labels
  database/models.py     # SQLAlchemy Listing model
  scraper/
    runner.py            # Playwright search + upsert
    parser.py            # Price/watt/qty/condition parsing
    classify.py          # €/W classification
    sources.py           # Per-country queries + exclusions
  templates/index.html   # RTL Arabic dashboard (Tailwind via CDN)
requirements.txt
```
