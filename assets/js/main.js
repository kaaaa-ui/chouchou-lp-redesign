/* =========================================================
   ChouChou LP — interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Hamburger / nav ---------- */
  var hamburger = document.getElementById('js-hamburger');
  var nav       = document.getElementById('js-nav');
  var overlay   = document.getElementById('js-overlay');

  function closeNav() {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  hamburger.addEventListener('click', function () {
    var open = nav.classList.toggle('active');
    hamburger.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  overlay.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });

  /* ---------- Scroll reveal ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Count-up for the headline stat ---------- */
  var statbox = document.querySelector('.statbox');
  if (statbox && 'IntersectionObserver' in window) {
    var counted = false;
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !counted) {
          counted = true;
          statbox.querySelectorAll('[data-to]').forEach(function (el) {
            var to = parseInt(el.getAttribute('data-to'), 10);
            var start = null;
            function tick(ts) {
              if (!start) start = ts;
              var p = Math.min((ts - start) / 900, 1);
              el.textContent = Math.max(1, Math.round(p * to));
              if (p < 1) requestAnimationFrame(tick); else el.textContent = to;
            }
            requestAnimationFrame(tick);
          });
          co.disconnect();
        }
      });
    }, { threshold: 0.5 });
    co.observe(statbox);
  }

  /* ---------- Review dots ---------- */
  var track = document.getElementById('js-review-track');
  var dotsWrap = document.getElementById('js-dots');
  if (track && dotsWrap) {
    var slides = track.querySelectorAll('.review');
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', (i + 1) + '番目の口コミ');
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () {
        slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll('button');
    var raf;
    track.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var center = track.scrollLeft + track.clientWidth / 2;
        var best = 0, bestDist = Infinity;
        slides.forEach(function (s, i) {
          var c = s.offsetLeft + s.clientWidth / 2;
          var d = Math.abs(c - center);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        dots.forEach(function (d, i) { d.classList.toggle('active', i === best); });
      });
    });
  }

  /* ---------- Floating CTA visibility ---------- */
  var floating = document.getElementById('js-floating');
  if (floating) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (window.pageYOffset / h) * 100 : 0;
      floating.classList.toggle('is-visible', pct > 8 && pct < 96);
    }, { passive: true });
  }

  /* ========================================================
     流入元別LINEリンク切り替え（本番ロジックを踏襲）
     utm_source に応じて全LINEボタンのリンク先を差し替える。
     ======================================================== */
  var LINE_LINKS = {
    youtube: 'https://chouchou-live.com/r/?rid=rt_ceb58c20',
    google:  'https://chouchou-live.com/r/?rid=rt_google_legacy',
    meta:    'https://chouchou-live.com/r/?rid=rt_meta_legacy',
    aff1:    'https://chouchou-live.com/r/?rid=rt_aff1_legacy',
    aff2:    'https://chouchou-live.com/r/?rid=rt_aff2_legacy',
    aff3:    'https://chouchou-live.com/r/?rid=rt_aff3_legacy',
    aff4:    'https://chouchou-live.com/r/?rid=rt_aff4_legacy',
    aff5:    'https://chouchou-live.com/r/?rid=rt_aff5_legacy'
  };
  var DEFAULT_LINK = 'https://chouchou-live.com/r/?rid=rt_555964e8';
  var STORAGE_KEY = 'lp_utm_source';
  var STORAGE_TTL = 1000 * 60 * 60 * 24 * 30;

  var params = new URLSearchParams(window.location.search);
  var utmSource = params.get('utm_source');
  if (utmSource) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: utmSource.toLowerCase(), ts: Date.now() })); } catch (e) {}
  } else {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && (Date.now() - saved.ts) < STORAGE_TTL) utmSource = saved.value;
    } catch (e) {}
  }
  var targetHref = (utmSource && LINE_LINKS[utmSource.toLowerCase()]) ? LINE_LINKS[utmSource.toLowerCase()] : DEFAULT_LINK;

  function getButtonLocation(el) {
    if (el.closest('#js-nav')) return 'nav';
    if (el.closest('#js-floating')) return 'floating';
    if (el.closest('.cta-area')) return 'cta_area';
    if (el.closest('.hero')) return 'hero';
    return 'other';
  }

  // 全てのリンク（/r/?rid= と lin.ee / line.me）を対象に差し替え＋計測
  var links = document.querySelectorAll('a[href*="chouchou-live.com/r/"], a[href*="lin.ee"], a[href*="line.me"]');
  links.forEach(function (link) {
    if (link.hasAttribute('data-no-line-swap')) return;
    link.setAttribute('href', targetHref);
    if (link.dataset.lineTracked === '1') return;
    link.dataset.lineTracked = '1';
    link.addEventListener('click', function () {
      if (typeof gtag !== 'function') return;
      gtag('event', 'line_click', {
        'utm_source': utmSource || 'direct',
        'button_location': getButtonLocation(this),
        'line_url': this.getAttribute('href'),
        'transport_type': 'beacon'
      });
    });
  });
})();
