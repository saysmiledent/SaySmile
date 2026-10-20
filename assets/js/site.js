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
      var anim = null;

      /* 0…40 % — только «До», 60…100 % — только «После»,
         между ними короткий плавный переход (smoothstep) */
      function set(v) {
        v = Number(v);
        var t = Math.min(1, Math.max(0, (v - 40) / 20));
        var after = t * t * (3 - 2 * t);
        box.style.setProperty('--p', (v / 100).toFixed(3));
        box.style.setProperty('--after', after.toFixed(3));
        box.setAttribute('data-state', v < 50 ? 'before' : 'after');
        input.setAttribute('aria-valuetext', v < 50 ? 'До' : 'После');
        var step = Math.round(v / 10);
        if (step !== lastStep) { lastStep = step; sfx.tick(); }
      }

      function glideTo(target) {
        if (anim) window.cancelAnimationFrame(anim);
        var from = Number(input.value);
        if (reduce || from === target) { input.value = target; set(target); return; }
        var start = null;
        function frame(ts) {
          if (start === null) start = ts;
          var k = Math.min(1, (ts - start) / 260);
          var e = 1 - Math.pow(1 - k, 3);
          var v = from + (target - from) * e;
          input.value = v;
          set(v);
          if (k < 1) anim = window.requestAnimationFrame(frame);
        }
        anim = window.requestAnimationFrame(frame);
      }

      input.addEventListener('input', function () {
        if (anim) { window.cancelAnimationFrame(anim); anim = null; }
        set(input.value);
      });
      /* отпустили ползунок посередине — докатываем до ближайшего края,
         чтобы две фотографии никогда не «висели» вместе */
      input.addEventListener('change', function () {
        var v = Number(input.value);
        if (v > 5 && v < 95) glideTo(v < 50 ? 0 : 100);
      });
      /* с клавиатуры стрелки сразу переключают «До» ↔ «После» */
      input.addEventListener('keydown', function (e) {
        var k = e.key;
        if (k === 'ArrowRight' || k === 'ArrowUp' || k === 'End') { e.preventDefault(); glideTo(100); }
        else if (k === 'ArrowLeft' || k === 'ArrowDown' || k === 'Home') { e.preventDefault(); glideTo(0); }
      });
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

  /* ================= Анимации ================= */

  /* Заголовок первого экрана: слова появляются по очереди */
  function initHeadline() {
    if (reduce) return;
    var h1 = document.querySelector('.hero .h1');
    if (!h1 || h1.getAttribute('data-split')) return;
    var text = h1.textContent.trim();
    h1.setAttribute('data-split', '1');
    h1.setAttribute('aria-label', text);
    h1.textContent = '';
    text.split(/\s+/).forEach(function (word, i, all) {
      var s = document.createElement('span');
      s.className = 'split-word';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--w', i);
      s.textContent = word;
      h1.appendChild(s);
      if (i < all.length - 1) h1.appendChild(document.createTextNode(' '));
    });
  }

  /* Шапка получает тень при прокрутке */
  function initHeaderShadow() {
    var header = document.querySelector('.header');
    if (!header) return;
    function update() { header.classList.toggle('scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Плавный переход между страницами (шторка + появление контента) */
  function initPageTransitions() {
    if (reduce) return;
    var curtain = document.createElement('div');
    curtain.className = 'page-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(curtain);

    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        root.classList.remove('leaving');
        curtain.classList.remove('cover');
      }
    });

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      if (a.origin !== window.location.origin) return;
      if (a.pathname === window.location.pathname && a.search === window.location.search) return;
      var href = a.href;
      e.preventDefault();
      root.classList.add('leaving');
      curtain.classList.add('cover');
      window.setTimeout(function () { window.location.href = href; }, 380);
    });
  }

  /* Мягкое свечение за курсором + параллакс фона первого экрана */
  function initPointerFx() {
    if (reduce || !finePointer) return;
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    var tx = window.innerWidth / 2, ty = window.innerHeight / 3;
    var gx = tx, gy = ty, running = false;
    var hero = document.querySelector('.hero');

    function loop() {
      gx += (tx - gx) * 0.14;
      gy += (ty - gy) * 0.14;
      glow.style.transform = 'translate(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px)';
      if (Math.abs(tx - gx) > 0.4 || Math.abs(ty - gy) > 0.4) {
        window.requestAnimationFrame(loop);
      } else {
        running = false;
      }
    }

    document.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('on');
      if (!running) { running = true; window.requestAnimationFrame(loop); }
      if (hero) {
        hero.style.setProperty('--px', (e.clientX / window.innerWidth - 0.5).toFixed(3));
        hero.style.setProperty('--py', (e.clientY / window.innerHeight - 0.5).toFixed(3));
      }
      /* подсветка карточки под курсором */
      var card = e.target.closest && e.target.closest('.card');
      if (card) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--cx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--cy', (e.clientY - r.top) + 'px');
      }
    }, { passive: true });

    document.addEventListener('pointerleave', function () { glow.classList.remove('on'); });
  }

  /* Кнопки: «магнит» к курсору и волна при нажатии */
  function initButtonFx() {
    if (reduce) return;
    document.addEventListener('pointerdown', function (e) {
      var btn = e.target.closest && e.target.closest('.btn');
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      var dot = document.createElement('span');
      dot.className = 'ripple';
      dot.style.left = (e.clientX - r.left) + 'px';
      dot.style.top = (e.clientY - r.top) + 'px';
      btn.appendChild(dot);
      window.setTimeout(function () { if (dot.parentNode) dot.parentNode.removeChild(dot); }, 700);
    });

    if (!finePointer) return;
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / r.width;
        var y = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.setProperty('--tx', (x * 8).toFixed(1) + 'px');
        btn.style.setProperty('--ty', (y * 6).toFixed(1) + 'px');
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.removeProperty('--tx');
        btn.style.removeProperty('--ty');
      });
    });
  }

  /* Цифры в цене плавно «набираются» при появлении */
  function initCounters() {
    var els = document.querySelectorAll('.stat strong');
    if (!els.length || reduce || !('IntersectionObserver' in window)) return;
    var pending = [];
    els.forEach(function (el) {
      var m = el.textContent.match(/(\d[\d\s ]*\d|\d)/);
      if (!m) return;
      var raw = m[1];
      var value = parseInt(raw.replace(/[\s ]/g, ''), 10);
      if (!value) return;
      pending.push({ el: el, raw: raw, value: value, text: el.textContent });
    });
    if (!pending.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var item = pending.filter(function (p) { return p.el === entry.target; })[0];
        if (!item) return;
        var start = null;
        var dur = 1400;
        function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
        function frame(ts) {
          if (start === null) start = ts;
          var k = Math.min(1, (ts - start) / dur);
          var e = 1 - Math.pow(1 - k, 4);
          item.el.textContent = item.text.replace(item.raw, fmt(Math.round(item.value * e / 50) * 50 || (k < 1 ? 0 : item.value)));
          if (k < 1) window.requestAnimationFrame(frame);
          else item.el.textContent = item.text;
        }
        window.requestAnimationFrame(frame);
      });
    }, { threshold: 0.6 });
    pending.forEach(function (p) { io.observe(p.el); });
  }

  /* ---------- Окно «Оставить заявку» ----------
     Сервера у сайта нет, поэтому заявка открывается в мессенджере/почте
     пациента с готовым текстом. Данные нигде на сайте не сохраняются. */
  function initRequestForm() {
    var dlg = document.getElementById('request-dialog');
    var openers = document.querySelectorAll('[data-open-request]');
    if (!dlg || !openers.length || typeof dlg.showModal !== 'function') {
      /* старый браузер: кнопки просто ведут в Telegram */
      openers.forEach(function (b) {
        b.addEventListener('click', function () { window.open('https://t.me/saySmaile', '_blank', 'noopener'); });
      });
      return;
    }

    var form = dlg.querySelector('form');
    var err = dlg.querySelector('.form-error');
    var note = dlg.querySelector('.form-note');
    var phoneInput = form.elements.phone;

    function reset() {
      err.hidden = true; note.hidden = true;
      phoneInput.removeAttribute('aria-invalid');
    }

    openers.forEach(function (b) {
      b.addEventListener('click', function () {
        reset();
        dlg.showModal();
        sfx.open();
        window.setTimeout(function () { form.elements.name.focus(); }, 50);
      });
    });
    dlg.querySelector('[data-close-request]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      reset();
      var name = form.elements.name.value.trim();
      var phone = phoneInput.value.trim();
      var digits = phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        phoneInput.setAttribute('aria-invalid', 'true');
        err.textContent = 'Укажите номер телефона полностью, например +7 900 000-00-00.';
        err.hidden = false;
        phoneInput.focus();
        return;
      }
      if (!form.elements.consent.checked) {
        err.textContent = 'Нужно согласие на обработку персональных данных.';
        err.hidden = false;
        return;
      }
      var via = form.elements.via.value;
      var text = 'Здравствуйте! ' + (name ? 'Меня зовут ' + name + '. ' : '') +
        'Хочу записаться на приём. Мой телефон: ' + phone + '.';

      if (via === 'whatsapp') {
        window.open('https://wa.me/79939813183?text=' + encodeURIComponent(text), '_blank', 'noopener');
        note.textContent = 'Открываю WhatsApp — останется нажать «Отправить».';
      } else if (via === 'email') {
        window.location.href = 'mailto:dr.seivan@mail.ru?subject=' + encodeURIComponent('Запись на приём') +
          '&body=' + encodeURIComponent(text);
        note.textContent = 'Открываю почтовое приложение с готовым письмом.';
      } else {
        var copied = false;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
            copied = true;
          }
        } catch (x) { /* буфер обмена недоступен */ }
        window.open('https://t.me/saySmaile', '_blank', 'noopener');
        note.textContent = copied
          ? 'Открываю Telegram. Текст заявки скопирован — вставьте его в чат и отправьте.'
          : 'Открываю Telegram. Напишите в чат своё имя и телефон.';
      }
      note.hidden = false;
      sfx.click();
    });
  }

  function init() {
    initRequestForm();
    initHeadline();
    buildFloating();
    buildProgress();
    initReveal();
    initTilt();
    initCompare();
    initLightbox();
    initButtonSounds();
    initHeaderShadow();
    initPageTransitions();
    initPointerFx();
    initButtonFx();
    initCounters();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
