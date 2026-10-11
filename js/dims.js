// User-adjustable interface sizes (board, racks, buttons, history log). Saved on this device.
import { DIMENSIONS } from './config.js';
import { $, S } from './state.js';

const KEY = 'scrabble.dims';
// [key, Arabic label, min, max, step]
const FIELDS = [
  ['boardScale', 'حجم اللوح', .5, 1.5, .05],
  ['rackScale', 'حجم الأرفف', .6, 1.3, .05],
  ['buttonScale', 'حجم الأزرار', .6, 1.6, .05],
  ['historyScale', 'حجم نص السجل', .6, 1.6, .05],
  ['historyHeightScale', 'ارتفاع السجل', .4, 1.6, .05],
  ['historyWidthScale', 'عرض السجل', .6, 1.6, .05]
];
const LIM = {boardScale: [.5, 1.5, 1], rackScale: [.5, 1, 1], buttonScale: [.6, 1.6, 1], buttonGap: [0, 24, 6], controlColumns: [1, 6, 3],
  historyScale: [.6, 1.6, 1], historyHeightScale: [.4, 1.6, 1], historyWidthScale: [.6, 1.6, 1]};
const n = (k, v) => { const [lo, hi, def] = LIM[k]; return Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : def; };

let dims = {...DIMENSIONS};

export function applyDimensions() {
  const r = document.documentElement.style, d = dims;
  r.setProperty('--board-scale', n('boardScale', d.boardScale));
  r.setProperty('--rack-scale', n('rackScale', d.rackScale));
  r.setProperty('--btn-scale', n('buttonScale', d.buttonScale));
  r.setProperty('--btn-gap', n('buttonGap', d.buttonGap) + 'px');
  r.setProperty('--ctrl-cols', Math.round(n('controlColumns', d.controlColumns)));
  r.setProperty('--hist-scale', n('historyScale', d.historyScale));
  r.setProperty('--hist-hs', n('historyHeightScale', d.historyHeightScale));
  r.setProperty('--hist-w', n('historyWidthScale', d.historyWidthScale));
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(dims)); } catch { /* storage unavailable */ } };
const show = (k, v) => Math.round(v * 100) + '%';

function buildRows() {
  $('#dmB').innerHTML = FIELDS.map(([k, label, lo, hi, st]) => `<div class="audioRow"><div class="audioRowHead"><label for="dm_${k}">${label}</label><output id="dmo_${k}">${show(k, n(k, dims[k]))}</output></div>`
    + `<input class="audioRange" id="dm_${k}" data-k="${k}" type="range" min="${lo}" max="${hi}" step="${st}" value="${n(k, dims[k])}"></div>`).join('');
}

export function initDims() {
  try { dims = {...DIMENSIONS, ...(JSON.parse(localStorage.getItem(KEY)) || {})}; } catch { /* use defaults */ }
  applyDimensions();
  $('#dmB').addEventListener('input', e => {
    const k = e.target.dataset.k; if (!k) return;
    dims[k] = n(k, e.target.value); $('#dmo_' + k).textContent = show(k, dims[k]); applyDimensions(); save();
  });
  $('#dmReset').addEventListener('click', () => {
    dims = {...DIMENSIONS}; try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    applyDimensions(); buildRows();
  });
  // One settings button: opens the existing audio dialog, which now also holds the size sliders.
  $('#bSettings').addEventListener('click', () => { buildRows(); S.paused = true; $('#bAudioSettings').click(); });
  $('#ad').addEventListener('close', () => { S.paused = false; S.last = performance.now(); });
}
