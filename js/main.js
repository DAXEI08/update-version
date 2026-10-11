// Application entry point.
import { TICK_MS } from './config.js';
import { S } from './state.js';
import { buildDom, chooseDuration } from './ui.js';
import { tick, newGame } from './game.js';
import { initInput } from './input.js';
import { initAudio } from './audio.js';
import { showCover } from './cover.js';
import { initDims } from './dims.js';

function start() {
  initDims();
  buildDom();
  initAudio();
  initInput();
  setInterval(tick, TICK_MS);
  newGame();
  S.paused = true;       // clock stays frozen until a duration is chosen
  showCover(chooseDuration);   // cover first; "Play" opens the duration prompt
}

start();
