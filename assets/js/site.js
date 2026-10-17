/* SaySmile — лёгкие визуальные и (по желанию) звуковые эффекты.
   Звук выключен по умолчанию и включается кнопкой в правом нижнем углу. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { /* хранилище может быть недоступно */ }
    return null;
  }

  /* ---------- Звук (Web Audio, без файлов) ---------- */
  var soundOn = store('ss-sound') === '1';
  var ctx = null;

  function audio() {
    if (!ctx) {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, delay) {
    if (!soundOn) return;
    var c = audio();
    if (!c) return;
    var t = c.currentTime + (delay || 0);
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol || 0.04, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  var lastHover = 0;
  var sfx = {
    hover: function () {
      var now = Date.now();
      if (now - lastHover < 120) return;
      lastHover = now;
      tone(880, 0.06, 'sine', 0.015);
    },
    click: function () {
      tone(660, 0.09, 'triangle', 0.04);
      tone(990, 0.12, 'sine', 0.03, 0.06);
    },
    open: function () {
      tone(523, 0.12, 'sine', 0.04);
      tone(659, 0.12, 'sine', 0.04, 0.08);
      tone(784, 0.22, 'sine', 0.04, 0.16);
    },
    tick: function () { tone(1200, 0.04, 'sine', 0.012); }
  };

  /* ---------- Плавающие кнопки: звук и «наверх» ---------- */
  function buildFloating() {
    var sticker = document.querySelector('.sticker');
    if (sticker) {
      sticker.setAttribute('role', 'button');
      sticker.setAttribute('tabindex', '0');
      sticker.setAttribute('aria-label', 'Наверх');
      sticker.title = 'Наверх';
      var toTop = function () {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        sfx.click();
      };
      sticker.addEventListener('click', toTop);
      sticker.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toTop(); }
      });
    }

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sound-toggle';
    function paint() {
      btn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      btn.setAttribute('aria-label', soundOn ? 'Выключить звуки сайта' : 'Включить звуки сайта');
      btn.title = soundOn ? 'Звук включён' : 'Звук выключен';
      btn.textContent = soundOn ? '🔊' : '🔇';
    }
    paint();
    btn.addEventListener('click', function () {
      soundOn = !soundOn;
      store('ss-sound', soundOn ? '1' : '0');
      paint();
      if (soundOn) sfx.open();
    });
    document.body.appendChild(btn);
  }

  /* ---------- Полоса прогресса прокрутки ---------- */
  function buildProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var h = root.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Появление блоков при прокрутке ---------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) return;
    items.forEach(function (el) {
      if (el.hasAttribute('data-stagger')) {
        Array.prototype.forEach.call(el.children, function (child, i) {
          child.style.transitionDelay = (i * 70) + 'ms';
        });
      }
    });
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
    /* страховка: если что-то не успело сработать, показываем всё */
    window.setTimeout(function () {
      items.forEach(function (el) { el.classList.add('visible'); });
    }, 4000);
  }

  /* ---------- Лёгкий наклон карточки врача ---------- */
  function initTilt() {
    if (reduce || !finePointer) return;
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- Слайдер «до / после» ---------- */
  function initCompare() {
    document.querySelectorAll('.compare').forEach(function (box) {
      var input = box.querySelector('input[type="range"]');
      if (!input) return;
      var lastStep = -1;
      function set(v) {
        box.style.setProperty('--pos', v + '%');
        var step = Math.round(v / 10);
        if (step !== lastStep) { lastStep = step; sfx.tick(); }
      }
      input.addEventListener('input', function () { set(input.value); });
      set(input.value);
      lastStep = -1;
    });
  }

  /* ---------- Просмотр «до / после» крупно ---------- */
  function initLightbox() {
    var triggers = document.querySelectorAll('[data-lightbox-before]');
    if (!triggers.length || typeof HTMLDialogElement === 'undefined') return;
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Просмотр фотографий');
    dlg.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Закрыть">×</button>' +
      '<div class="lightbox-grid">' +
      '<figure><img alt="" /><figcaption>До</figcaption></figure>' +
      '<figure><img alt="" /><figcaption>После</figcaption></figure>' +
      '</div><p class="lightbox-title"></p>';
    document.body.appendChild(dlg);
    var imgs = dlg.querySelectorAll('img');
    var title = dlg.querySelector('.lightbox-title');
    triggers.forEach(function (t) {
      t.addEventListener('click', function () {
        imgs[0].src = t.getAttribute('data-lightbox-before');
        imgs[1].src = t.getAttribute('data-lightbox-after');
        var label = t.getAttribute('data-title') || '';
        imgs[0].alt = 'До: ' + label;
        imgs[1].alt = 'После: ' + label;
        title.textContent = label;
        dlg.showModal();
        sfx.open();
      });
    });
    dlg.querySelector('.lightbox-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- Звуки наведения и нажатия ---------- */
  function initButtonSounds() {
    document.addEventListener('pointerover', function (e) {
      var el = e.target.closest && e.target.closest('.btn, .chip, .menu a');
      if (el) sfx.hover();
    });
    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('.btn, .chip, .menu a');
      if (el) sfx.click();
    });
  }

  function init() {
    buildFloating();
    buildProgress();
    initReveal();
    initTilt();
    initCompare();
    initLightbox();
    initButtonSounds();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
