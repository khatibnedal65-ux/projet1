'use strict';

// ── pdf.js worker ─────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ── State ─────────────────────────────────────────────────
let pdfDoc       = null;
let pageFlip     = null;
let totalPages   = 0;
let currentScale = 1.0;
let fileName     = '';
const SCALE_STEP = 0.25;
const SCALE_MIN  = 0.5;
const SCALE_MAX  = 3.0;
const BASE_PAGE_W = 600;  // logical page width used as reference

// ── DOM refs ──────────────────────────────────────────────
const uploadScreen    = document.getElementById('upload-screen');
const viewerScreen    = document.getElementById('viewer-screen');
const pdfInput        = document.getElementById('pdf-input');
const uploadBox       = document.getElementById('upload-box');
const backBtn         = document.getElementById('back-btn');
const darkModeBtn     = document.getElementById('dark-mode-btn');
const fullscreenBtn   = document.getElementById('fullscreen-btn');
const prevBtn         = document.getElementById('prev-btn');
const nextBtn         = document.getElementById('next-btn');
const zoomInBtn       = document.getElementById('zoom-in-btn');
const zoomOutBtn      = document.getElementById('zoom-out-btn');
const zoomLabel       = document.getElementById('zoom-label');
const currentPageEl   = document.getElementById('current-page');
const totalPagesEl    = document.getElementById('total-pages');
const progressBar     = document.getElementById('progress-bar');
const loadingLabel    = document.getElementById('loading-label');
const loadingPercent  = document.getElementById('loading-percent');
const fileNameDisplay = document.getElementById('file-name-display');
const flipbookEl      = document.getElementById('flipbook');

// ── File input / drag-drop ─────────────────────────────────
pdfInput.addEventListener('change', e => loadFile(e.target.files[0]));

uploadBox.addEventListener('dragover', e => { e.preventDefault(); uploadBox.classList.add('drag-over'); });
uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('drag-over'));
uploadBox.addEventListener('drop', e => {
  e.preventDefault();
  uploadBox.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') loadFile(file);
});

// ── Load PDF ───────────────────────────────────────────────
async function loadFile(file) {
  if (!file) return;
  fileName = file.name;
  fileNameDisplay.textContent = fileName;

  showViewer();
  setProgress(0);

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

  loadingTask.onProgress = ({ loaded, total }) => {
    if (total) setProgress(Math.round((loaded / total) * 30)); // first 30% = download
  };

  pdfDoc = await loadingTask.promise;
  totalPages = pdfDoc.numPages;
  totalPagesEl.textContent = totalPages;

  await buildFlipbook();

  const saved = getSavedPage();
  if (saved > 1 && saved <= totalPages) {
    // StPageFlip uses 0-based index, spreads mean page index = page-1
    pageFlip.turnToPage(saved - 1);
  }
}

// ── Build flipbook ─────────────────────────────────────────
async function buildFlipbook() {
  // Destroy previous instance
  if (pageFlip) {
    pageFlip.destroy();
    pageFlip = null;
  }
  flipbookEl.innerHTML = '';

  // Render all pages to canvases at current scale
  const canvases = await renderAllPages();

  // Determine page dimensions from first canvas
  const w = canvases[0].width;
  const h = canvases[0].height;

  // Fit to available viewport
  const wrap = document.getElementById('flipbook-wrap');
  const availW = wrap.clientWidth  - 32;
  const availH = wrap.clientHeight - 32;

  // StPageFlip in landscape shows two pages side by side
  const spreadW = Math.min(availW, w * 2);
  const spreadH = Math.min(availH, h);
  const ratio   = Math.min(spreadW / (w * 2), spreadH / h);
  const pageW   = Math.round(w * ratio);
  const pageH   = Math.round(h * ratio);

  // Add page elements to flipbook div
  canvases.forEach(c => {
    const el = document.createElement('div');
    el.classList.add('page');
    el.appendChild(c);
    flipbookEl.appendChild(el);
  });

  pageFlip = new St.PageFlip(flipbookEl, {
    width:          pageW,
    height:         pageH,
    showCover:      true,
    drawShadow:     true,
    flippingTime:   700,
    usePortrait:    window.innerWidth < 700,
    autoSize:       true,
    maxShadowOpacity: 0.5,
    mobileScrollSupport: true,
  });

  pageFlip.loadFromHTML(document.querySelectorAll('.page'));

  pageFlip.on('flip', e => {
    updatePageDisplay(e.data + 1);
    savePage(e.data + 1);
  });

  updatePageDisplay(1);
  hideLoading();
}

// ── Render pages to canvas ─────────────────────────────────
async function renderAllPages() {
  // Get viewport from page 1 to know native dimensions
  const firstPage = await pdfDoc.getPage(1);
  const viewport0  = firstPage.getViewport({ scale: 1 });
  const scale      = (BASE_PAGE_W * currentScale) / viewport0.width;

  const canvases = [];

  for (let i = 1; i <= totalPages; i++) {
    const page     = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas   = document.createElement('canvas');
    canvas.width   = Math.round(viewport.width);
    canvas.height  = Math.round(viewport.height);
    const ctx      = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport }).promise;
    canvases.push(canvas);

    const pct = 30 + Math.round((i / totalPages) * 70);
    setProgress(pct);
    loadingPercent.textContent = pct + '%';
  }

  return canvases;
}

// ── Navigation ─────────────────────────────────────────────
prevBtn.addEventListener('click', () => pageFlip && pageFlip.flipPrev());
nextBtn.addEventListener('click', () => pageFlip && pageFlip.flipNext());

// ── Zoom ───────────────────────────────────────────────────
zoomInBtn.addEventListener('click', () => applyZoom(currentScale + SCALE_STEP));
zoomOutBtn.addEventListener('click', () => applyZoom(currentScale - SCALE_STEP));

async function applyZoom(newScale) {
  newScale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, newScale));
  if (newScale === currentScale) return;
  currentScale = newScale;
  zoomLabel.textContent = Math.round(currentScale * 100) + '%';

  // Remember page, rebuild, go back
  const page = pageFlip ? (pageFlip.getCurrentPageIndex() + 1) : 1;
  showLoading();
  await buildFlipbook();
  if (page > 1) pageFlip.turnToPage(page - 1);
}

// ── Dark mode ──────────────────────────────────────────────
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  darkModeBtn.textContent = document.body.classList.contains('dark') ? '☀' : '☾';
  localStorage.setItem('flipbook-dark', document.body.classList.contains('dark') ? '1' : '0');
});

if (localStorage.getItem('flipbook-dark') === '1') {
  document.body.classList.add('dark');
  darkModeBtn.textContent = '☀';
}

// ── Fullscreen ─────────────────────────────────────────────
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

document.addEventListener('fullscreenchange', () => {
  fullscreenBtn.textContent = document.fullscreenElement ? '⛶' : '⛶';
});

// ── Back to upload ─────────────────────────────────────────
backBtn.addEventListener('click', () => {
  if (pageFlip) { pageFlip.destroy(); pageFlip = null; }
  pdfDoc = null;
  flipbookEl.innerHTML = '';
  pdfInput.value = '';
  currentScale = 1.0;
  zoomLabel.textContent = '100%';
  viewerScreen.classList.add('hidden');
  uploadScreen.classList.remove('hidden');
});

// ── UI helpers ─────────────────────────────────────────────
function showViewer() {
  uploadScreen.classList.add('hidden');
  viewerScreen.classList.remove('hidden');
  showLoading();
}

function showLoading() {
  loadingLabel.classList.remove('done');
  progressBar.style.width = '0%';
  loadingPercent.textContent = '0%';
}

function hideLoading() {
  progressBar.style.width = '100%';
  loadingPercent.textContent = '100%';
  setTimeout(() => loadingLabel.classList.add('done'), 400);
}

function setProgress(pct) {
  progressBar.style.width = pct + '%';
  loadingPercent.textContent = pct + '%';
}

function updatePageDisplay(page) {
  currentPageEl.textContent = page;
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= totalPages;
}

// ── localStorage ──────────────────────────────────────────
function storageKey() { return 'flipbook-page:' + fileName; }
function savePage(n)   { try { localStorage.setItem(storageKey(), n); } catch(_) {} }
function getSavedPage(){ try { return parseInt(localStorage.getItem(storageKey()), 10) || 1; } catch(_) { return 1; } }

// ── Keyboard shortcuts ─────────────────────────────────────
document.addEventListener('keydown', e => {
  if (!pageFlip) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  pageFlip.flipNext();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    pageFlip.flipPrev();
  if (e.key === '+' || e.key === '=') applyZoom(currentScale + SCALE_STEP);
  if (e.key === '-')                   applyZoom(currentScale - SCALE_STEP);
});

// ── Resize: rebuild with new dimensions ───────────────────
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(async () => {
    if (!pdfDoc) return;
    const page = pageFlip ? (pageFlip.getCurrentPageIndex() + 1) : 1;
    showLoading();
    await buildFlipbook();
    if (page > 1) pageFlip.turnToPage(page - 1);
  }, 400);
});
