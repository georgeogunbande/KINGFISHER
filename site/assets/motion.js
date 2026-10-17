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
