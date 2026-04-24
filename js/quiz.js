'use strict';

const TOTAL = 12;

const JP_NUMS = [
  '第一問','第二問','第三問','第四問','第五問','第六問',
  '第七問','第八問','第九問','第十問','第十一問','第十二問'
];

let questions = [];
let answers   = [];
let current   = 0;
let locked    = false;

// ── Init ────────────────────────────────────────────────────────────────
function init() {
  spawnStars();
  questions = selectQuestions(TOTAL);
  answers   = [];

  document.getElementById('start-btn').addEventListener('click', startQuiz);
}

// ── Starfield ────────────────────────────────────────────────────────────
function spawnStars() {
  const wrap = document.getElementById('stars');
  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    el.className = 'star';
    const size = Math.random() * 2.2 + 0.4;
    el.style.cssText = [
      `width:${size}px`, `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `top:${Math.random() * 100}%`,
      `--dur:${(Math.random() * 4 + 2).toFixed(1)}s`,
      `--delay:${(Math.random() * 6).toFixed(1)}s`,
      `--bright:${(Math.random() * 0.55 + 0.25).toFixed(2)}`,
    ].join(';');
    wrap.appendChild(el);
  }
}

// ── Screen switch ────────────────────────────────────────────────────────
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Start ────────────────────────────────────────────────────────────────
function startQuiz() {
  show('quiz');
  renderQuestion(0);
}

// ── Render question ──────────────────────────────────────────────────────
function renderQuestion(idx) {
  locked = false;
  const block = document.getElementById('question-block');

  // reset animation
  block.classList.remove('leaving');
  block.style.animation = 'none';
  void block.offsetWidth;
  block.style.animation = '';
  block.classList.add('question-block');

  document.getElementById('q-label').textContent = JP_NUMS[idx] ?? `第${idx + 1}問`;
  document.getElementById('q-text').textContent  = questions[idx].text;

  const optsEl = document.getElementById('options');
  optsEl.innerHTML = '';

  questions[idx].options.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className   = 'opt-btn';
    btn.textContent = text;
    btn.addEventListener('click', () => choose(i));
    optsEl.appendChild(btn);
  });

  updateProgress(idx);
}

// ── Progress bar ─────────────────────────────────────────────────────────
function updateProgress(idx) {
  const pct = (idx / TOTAL) * 100;
  document.getElementById('progress-fill').style.width  = `${pct}%`;
  document.getElementById('progress-count').textContent = `${idx + 1} / ${TOTAL}`;
}

// ── Choose answer ────────────────────────────────────────────────────────
function choose(optIdx) {
  if (locked) return;
  locked = true;

  answers.push(optIdx);

  // highlight chosen
  const btns = document.querySelectorAll('.opt-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === optIdx) btn.classList.add('chosen');
  });

  setTimeout(() => {
    const block = document.getElementById('question-block');
    block.classList.add('leaving');

    setTimeout(() => {
      current++;
      if (current >= TOTAL) {
        finalize();
      } else {
        renderQuestion(current);
      }
    }, 280);
  }, 350);
}

// ── Finish ───────────────────────────────────────────────────────────────
function finalize() {
  localStorage.setItem('fortuneAnswers', JSON.stringify(answers));
  document.getElementById('progress-fill').style.width  = '100%';
  document.getElementById('progress-count').textContent = `${TOTAL} / ${TOTAL}`;
  show('complete');
}

document.addEventListener('DOMContentLoaded', init);
