// Judging: the challenger (player now on turn) simply validates the last move as correct or incorrect.
import { PENALTY, NAMES } from './config.js';
import { $, S, app, cur, restore } from './state.js';
import { toast, render, chips } from './ui.js';
import { tick, nextTurn } from './game.js';
import { setMusicDucked } from './audio.js';

export function openJudge() {
  const e = S.hist[S.hist.length - 1];
  if (S.ended || S.swap || S.move.length || !S.undo || !e || e.type !== 'move' || e.st) return;
  app.judge = {e};
  S.paused = true; setMusicDucked(true); renderJudge(); $('#jd').showModal();
}
// Dialog closed without applying a verdict (Esc / cancel): drop the session and resume the clock.
export function abortJudge() {
  if (app.judge) { app.judge = null; setMusicDucked(false); S.paused = false; S.last = performance.now(); }
}
function renderJudge() {
  const e = app.judge.e;
  $('#jT').textContent = 'تحكيم الحركة';
  $('#jB').innerHTML = `<p>${NAMES[e.p]} · الحركة ${e.n} · ${e.total} نقطة</p>${chips(e)}<p>هل الكلمة صحيحة؟</p>`
    + '<div class="vrow"><button class="btn yes" data-a="yes">✔ صحيحة</button><button class="btn danger" data-a="no">✖ غير صحيحة</button></div>'
    + '<button class="btn" data-a="close">إلغاء</button>';
}
export function onJudgeClick(ev) {
  if (!app.judge) return;
  const a = ev.target.closest('[data-a]')?.dataset.a;
  if (a === 'close') return $('#jd').close();
  if (a === 'yes' || a === 'no') applyVerdict(a === 'yes');
}
function applyVerdict(ok) {
  const e = app.judge.e, u = S.undo;
  e.st = ok ? 'ok' : 'void';
  app.judge = null; setMusicDucked(false); $('#jd').close(); S.paused = false; S.last = performance.now(); S.hv++;
  if (ok) {
    const ch = cur(); e.pen = Math.min(PENALTY, ch.score); ch.score -= e.pen; S.undo = null; S.pop = S.cur;
    toast(`الكلمة صحيحة — غرامة ${e.pen} على ${NAMES[S.cur]}`, false); return render();
  }
  tick(); if (S.ended) return;
  restore(u, true);
  toast(`الكلمة غير صحيحة — يفقد ${NAMES[e.p]} دوره`, false); nextTurn();
}
