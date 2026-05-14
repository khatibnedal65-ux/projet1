# PDF Flipbook

A free, privacy-first web app that renders any PDF as an interactive flipbook with realistic page-turn animations — entirely in the browser. No login, no server, no data ever leaves your device.

## Features

- **Upload PDF** from your device (drag & drop or file picker)
- **Realistic page flip** animations powered by [StPageFlip](https://github.com/Nodlik/StPageFlip)
- **PDF rendering** via [Mozilla pdf.js](https://mozilla.github.io/pdf.js/)
- **Zoom in / out** (50% – 300%)
- **Previous / Next** page buttons + keyboard arrows
- **Fullscreen** mode
- **Dark mode** (persisted in localStorage)
- **Loading progress bar** while rendering pages
- **Saves last opened page** per file name in localStorage
- Works on **desktop and mobile**

## Usage

### Option 1 – Open directly
Just open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari).

### Option 2 – Local server (recommended for larger PDFs)
```bash
# Python 3
python3 -m http.server 8080
# then open http://localhost:8080
```
or
```bash
# Node.js (npx)
npx serve .
```

## Project Structure

```
projet1/
├── index.html   # App shell & CDN script tags
├── style.css    # All styles (light + dark theme)
├── script.js    # PDF loading, rendering, flipbook logic
└── README.md
```

## Dependencies (CDN, no install needed)

| Library | Version | Purpose |
|---------|---------|---------|
| pdf.js  | 3.11.174 | Parse & render PDF pages to canvas |
| StPageFlip | 2.0.7 | Page-flip animation |

## Privacy

All processing happens in your browser. No files are uploaded anywhere.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| → / ↓ | Next page |
| ← / ↑ | Previous page |
| + / = | Zoom in |
| - | Zoom out |
