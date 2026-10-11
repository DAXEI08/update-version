// Application entry point.
import { TICK_MS, DIMENSIONS } from './config.js';
import { S } from './state.js';
import { buildDom, chooseDuration } from './ui.js';
import { tick, newGame } from './game.js';
import { initInput } from './input.js';
import { initAudio } from './audio.js';
import { showCover } from './cover.js';

// Push the DIMENSIONS from config.js into CSS variables (values are clamped to safe ranges).
function applyDimensions() {
  const root = document.documentElement.style, d = DIMENSIONS;
  const n = (v, lo, hi, def) => Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : def;
  root.setProperty('--board-scale', n(d.boardScale, .5, 1.5, 1));
  root.setProperty('--btn-scale', n(d.buttonScale, .6, 1.6, 1));
  root.setProperty('--btn-gap', n(d.buttonGap, 0, 24, 6) + 'px');
  root.setProperty('--ctrl-cols', Math.round(n(d.controlColumns, 1, 6, 3)));
  root.setProperty('--hist-scale', n(d.historyScale, .6, 1.6, 1));
  root.setProperty('--hist-h', n(d.historyHeight, 120, 900, 360) + 'px');
  root.setProperty('--hist-w', n(d.historyWidthScale, .6, 1.6, 1));
}

function start() {
  applyDimensions();
  buildDom();
  initAudio();
  initInput();
  setInterval(tick, TICK_MS);
  newGame();
  S.paused = true;       // clock stays frozen until a duration is chosen
  showCover(chooseDuration);   // cover first; "Play" opens the duration prompt
}

start();
