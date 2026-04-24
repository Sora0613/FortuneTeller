'use strict';

// ── カード定義（順番・アイコン・描画ロジック）──────────────────────────
const CARDS = [
  {
    key: 'luck',
    icon: '✨',
    label: '今日の運勢',
    render(v) {
      const stars = Array.from({ length: 5 }, (_, i) =>
        `<span class="s${i < v.stars ? '' : ' off'}">★</span>`
      ).join('');
      return `
        <div class="stars-row">${stars}</div>
        <div class="card-value big">${v.title}</div>
        <div class="card-value small" style="margin-top:0.3rem">${v.desc}</div>
      `;
    }
  },
  {
    key: 'luckyItem',
    icon: '🌟',
    label: 'ラッキーアイテム',
    render: v => `<div class="card-value big">${v}</div>`
  },
  {
    key: 'luckyColor',
    icon: '🎨',
    label: 'ラッキーカラー',
    render(v) {
      return `
        <div class="color-dot" style="background:${v.hex};box-shadow:0 0 14px ${v.hex}99"></div>
        <div class="card-value big">${v.name}</div>
        <div class="card-value small">${v.meaning}</div>
      `;
    }
  },
  {
    key: 'caution',
    icon: '⚠️',
    label: '今日の注意',
    render: v => `<div class="card-value">${v}</div>`
  },
  {
    key: 'food',
    icon: '🍽️',
    label: '運気アップ食材',
    render: v => `<div class="card-value big">${v}</div>`
  },
  {
    key: 'luckyNumber',
    icon: '🔢',
    label: 'ラッキーナンバー',
    render(v) {
      return `
        <div class="card-value huge">${v.num}</div>
        <div class="card-value small">${v.meaning}</div>
      `;
    }
  },
  {
    key: 'luckyDirection',
    icon: '🧭',
    label: 'ラッキー方角',
    render(v) {
      return `
        <div class="card-value big">${v.dir}</div>
        <div class="card-value small">${v.meaning}</div>
      `;
    }
  },
  {
    key: 'keyword',
    icon: '🔑',
    label: '今日のキーワード',
    render: v => `<div class="card-value big">${v}</div>`
  },
  {
    key: 'compatibility',
    icon: '💫',
    label: '相性の良い人',
    render: v => `<div class="card-value">${v}</div>`
  },
  {
    key: 'luckyTime',
    icon: '⏰',
    label: 'ラッキータイム',
    render(v) {
      return `
        <div class="card-value big" style="font-size:0.88rem">${v.time}</div>
        <div class="card-value small">${v.meaning}</div>
      `;
    }
  },
  {
    key: 'place',
    icon: '🗺️',
    label: 'パワースポット',
    render: v => `<div class="card-value big">${v}</div>`
  },
  {
    key: 'message',
    icon: '💌',
    label: '今日のメッセージ',
    render: v => `<div class="card-value small" style="font-size:0.7rem;line-height:1.75">${v}</div>`
  },
];

// ── Init ────────────────────────────────────────────────────────────────
function init() {
  spawnStars();

  const raw = localStorage.getItem('fortuneAnswers');
  if (!raw) {
    window.location.href = 'index.html';
    return;
  }

  const answers = JSON.parse(raw);
  const fortune = computeFortune(answers);
  renderCards(fortune);
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

// ── Render cards ─────────────────────────────────────────────────────────
function renderCards(fortune) {
  const grid = document.getElementById('cards-grid');

  CARDS.forEach((cfg, i) => {
    const val = fortune[cfg.key];

    const wrap = document.createElement('div');
    wrap.className = 'card-wrap';
    wrap.style.animationDelay = `${i * 0.08}s`;

    wrap.innerHTML = `
      <div class="card">
        <div class="card-face card-back">
          <div class="card-back-sym">✦</div>
          <div class="card-back-label">${cfg.label}</div>
        </div>
        <div class="card-face card-front">
          <div class="card-icon">${cfg.icon}</div>
          <div class="card-category">${cfg.label}</div>
          ${cfg.render(val)}
        </div>
      </div>
    `;

    wrap.addEventListener('click', () => wrap.classList.toggle('flipped'));
    grid.appendChild(wrap);
  });
}

document.addEventListener('DOMContentLoaded', init);
