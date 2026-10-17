/* Shared motion for georgeogunbande.com. See motion.css. Safe to remove. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var doc = document;

  /* ---- 2. Ghost words ---- */
  var GHOST = { work: 'Flow', books: 'Books', shelf: 'Books', about: 'About', speaking: 'Speaking', articles: 'Articles' };
  Object.keys(GHOST).forEach(function (id) {
    var el = doc.getElementById(id);
    if (!el || el.hasAttribute('data-ghost') || el.closest('.kf')) return;
    el.setAttribute('data-ghost', GHOST[id]);
    var g = doc.createElement('div');
    g.className = 'ghostword'; g.setAttribute('aria-hidden', 'true'); g.textContent = GHOST[id];
    el.insertBefore(g, el.firstChild);
  });

  /* ---- 3. Hero pointer parallax ---- */
  var hero = doc.querySelector('.kf');
  if (hero && !reduce && matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5) * 2);
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5) * 2);
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0);
    });
  }

  /* ---- 1. Scroll reveals ---- */
  if (reduce || !('IntersectionObserver' in window)) return;
  var SEL = [
    '.page-hero .wrap > *', '.hero-plain .wrap > *', '.label', '.sec-head', '.sec-top', '.role', '.feature', '.book', '.proof',
    '.cta-strip', '.about-grid > *', '.speak-grid > *', '.bio', '.topics li', '.art', '.art-card', '.work-intro', '.product',
    '.fp-feats > div', '.fp-beta', '.steps li', '.fbt', '.more > *', '.feat', '.split > *', '.faq details', '.prose > h2',
    '.prose > p', '.prose > ul', '.prose > ol', '.prose > .tbl', '.aside', '.answer', '.contact-grid > *', '.way', '.venture',
    '.news-grid > *', '.review', '.author > *', '.pull', '.order > *', '.hero .hero-copy > *', '.hero .cover'
  ].join(',');
  var items = Array.prototype.filter.call(doc.querySelectorAll(SEL), function (el) {
    return !el.closest('.kf, header, nav, footer, .menu-btn') && !el.querySelector(':scope > .ghostword, [data-ghost]');
  });
  /* skip an element if one of its ancestors is also being revealed (the parent carries the motion) */
  var set = new Set(items);
  items = items.filter(function (el) { var p = el.parentElement; while (p) { if (set.has(p)) return false; p = p.parentElement; } return true; });

  var seen = new Map();
  items.forEach(function (el) {
    var p = el.parentElement, i = seen.get(p) || 0; seen.set(p, i + 1);
    el.classList.add('mv'); el.style.transitionDelay = (Math.min(i, 5) * 80) + 'ms';
  });

  function done(el) {
    el.classList.remove('mv', 'in'); el.style.transitionDelay = '';
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; io.unobserve(el);
      el.classList.add('in');
      var fin = false, end = function () { if (!fin) { fin = true; done(el); } };
      el.addEventListener('transitionend', function (ev) { if (ev.propertyName === 'opacity') end(); });
      setTimeout(end, 1800);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

/* ---- 4 & 5. Kingfisher on the scroll bar, and book tilt ---- */
(function () {
  var doc = document;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var head = doc.querySelector('.head, .site-head');
  if (head) {
    var own = false, bar = doc.getElementById('progress');
    if (!bar) {
      bar = doc.createElement('div'); bar.className = 'kf-progress'; bar.setAttribute('aria-hidden', 'true');
      head.appendChild(bar); own = true;
    }
    var bird = doc.createElement('div');
    bird.className = 'kfb'; bird.setAttribute('aria-hidden', 'true');
    bird.innerHTML = '<svg viewBox="0 0 24 15" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M3 9.5C6 4 13 3 20 5.6L23.4 7l-3.6.9C18.6 11 14 13.4 8 13.2 5.6 13 3.8 11.6 3 9.5Z" fill="#0E7C86"/>' +
      '<path d="M8 13.2c3.4.1 7-1.4 9.4-4.4l-5 .3C10.8 10.6 9.4 12 8 13.2Z" fill="#C0481C"/>' +
      '<path class="wing" d="M9 6.4C10.5.8 15.6-.4 18.4 2.4 15.4 2.4 13 4 12 7Z" fill="#1E5B8A"/>' +
      '<path d="M20.2 5.8 24 7.2l-3.6 1Z" fill="#10201F"/><circle cx="18.4" cy="6" r=".7" fill="#fff"/></svg>';
    head.appendChild(bird);

    var last = 0, dir = 1, tick = false, mt;
    function update() {
      tick = false;
      var h = doc.documentElement.scrollHeight - innerHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0;
      if (own) bar.style.transform = 'scaleX(' + p + ')';
      var x = p * head.clientWidth - 12;
      if (scrollY !== last) dir = scrollY > last ? 1 : -1;
      bird.style.transform = 'translate3d(' + x + 'px,0,0) scaleX(' + (p >= .985 ? 1 : dir) + ')';
      bird.classList.toggle('landed', p >= .985);
      if (!reduce && scrollY !== last) {
        bird.classList.add('moving'); clearTimeout(mt);
        mt = setTimeout(function () { bird.classList.remove('moving'); }, 160);
      }
      last = scrollY;
    }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  if (!reduce && matchMedia('(pointer: fine)').matches) {
    Array.prototype.forEach.call(doc.querySelectorAll('a.cover, figure.cover, .fbt-covers a'), function (el) {
      el.classList.add('tilt');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.setProperty('--ry', (px * 14).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-py * 12).toFixed(2) + 'deg');
        el.style.setProperty('--shx', (-px * 22).toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); el.style.setProperty('--shx', '0px');
      });
    });
  }
})();
