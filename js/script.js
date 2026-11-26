/* Aman Sharma — Portfolio interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var EMAIL = 'sharmakaman2545@gmail.com';

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var mobileNav = document.getElementById('mobile-nav');
  var menuIcon = menuBtn.querySelector('use');
  function setMenuIcon(open) {
    menuIcon.setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  function closeMenu() {
    mobileNav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    setMenuIcon(false);
  }
  menuBtn.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    setMenuIcon(open);
  });
  mobileNav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 960) closeMenu();
  });

  /* ---------- Scrollspy (active nav link) ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var spyLinks = navLinks.map(function (link) {
    var id = link.getAttribute('href').slice(1);
    var sec = document.getElementById(id);
    return sec ? { link: link, sec: sec } : null;
  }).filter(Boolean);
  if ('IntersectionObserver' in window && spyLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          var match = spyLinks.filter(function (s) { return s.sec === entry.target; })[0];
          if (match) match.link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    spyLinks.forEach(function (s) { spy.observe(s.sec); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Lightbox ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.g-item, .cert-media'));
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-caption');
  var lbClose = document.getElementById('lb-close');
  var lbPrev = document.getElementById('lb-prev');
  var lbNext = document.getElementById('lb-next');
  var current = 0;
  var lastFocus = null;

  function render(i) {
    var a = items[i];
    if (!a) return;
    current = i;
    var src = a.getAttribute('href');
    var caption = a.getAttribute('data-caption') || '';
    var thumb = a.querySelector('img');
    lbImg.src = src;
    lbImg.alt = thumb ? thumb.alt : caption;
    lbCap.textContent = caption;
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    render(i);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function step(dir) {
    render((current + dir + items.length) % items.length);
  }

  items.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      openLb(i);
    });
  });
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', function () { step(-1); });
  lbNext.addEventListener('click', function () { step(1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- Contact form (Web3Forms) ---------- */
  var form = document.getElementById('contact-form');
  var statusEl = document.getElementById('form-status');
  var submitBtn = document.getElementById('cf-submit');
  var honeypot = form.querySelector('input[name="botcheck"]');

  function setStatus(kind, msg) {
    statusEl.className = 'form-status show ' + (kind ? 'is-' + kind : '');
    statusEl.textContent = msg;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Honeypot: bots fill it, humans never see it — silently drop */
    if (honeypot && honeypot.checked) {
      setStatus('ok', 'Thanks! Your message has been sent.');
      form.reset();
      return;
    }

    var key = form.querySelector('input[name="access_key"]').value;
    if (!key || key.indexOf('YOUR_') === 0) {
      setStatus('info',
        'The form needs one final setup step (a free Web3Forms access key) before it can send. ' +
        'Until then, please email me directly at ' + EMAIL + ' — I reply quickly.');
      return;
    }

    var data = {
      access_key: key,
      name: form.elements['name'].value,
      email: form.elements['email'].value,
      message: form.elements['message'].value,
      from_name: 'Portfolio Contact Form',
      subject: 'New portfolio message from ' + form.elements['name'].value
    };

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    statusEl.classList.remove('show');

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json && json.success) {
          setStatus('ok', 'Thank you! Your message is on its way to my inbox — I will get back to you soon.');
          form.reset();
        } else {
          setStatus('err', 'Something went wrong sending your message. Please try again, or email me directly at ' + EMAIL + '.');
        }
      })
      .catch(function () {
        setStatus('err', 'Could not reach the mail service. Please try again, or email me directly at ' + EMAIL + '.');
      })
      .finally(function () {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Back to top (hidden while footer is on screen) ---------- */
  var toTop = document.getElementById('to-top');
  var siteFooter = document.querySelector('.site-footer');
  function footerVisible() {
    if (!siteFooter) return false;
    var r = siteFooter.getBoundingClientRect();
    return r.top < window.innerHeight * 0.9 && r.bottom > 0;
  }
  function toggleTop() {
    toTop.classList.toggle('show', window.scrollY > 640 && !footerVisible());
  }
  window.addEventListener('scroll', toggleTop, { passive: true });
  toggleTop();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
