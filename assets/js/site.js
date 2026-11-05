// Shared behaviour for every page: header, mobile menu, section highlighting,
// reveal-on-scroll, project filter, contact form and back-to-top button.
(() => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.getElementById('site-nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Header turns solid once the page scrolls (sub-pages start solid).
  if (header && !header.hasAttribute('data-solid')) {
    const setSolid = () => header.classList.toggle('is-solid', window.scrollY > 24);
    setSolid();
    window.addEventListener('scroll', setSolid, { passive: true });
  }

  // Mobile menu
  if (header && toggle && menu) {
    const setOpen = (open) => {
      header.dataset.open = String(open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', (e) => {
      if (header.dataset.open === 'true' && !e.target.closest('[data-header]')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.dataset.open === 'true') { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1001px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  const hasIO = 'IntersectionObserver' in window;

  // Highlight the nav link for the section in view.
  const sectionLinks = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  if (hasIO && sectionLinks.length) {
    const byId = new Map(sectionLinks.map((a) => [a.hash.slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(entry.target.id)?.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  // Fade sections in as they arrive.
  const reveals = document.querySelectorAll('.reveal');
  if (hasIO && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // Project filter
  const filters = document.querySelectorAll('[data-filter]');
  filters.forEach((btn) => btn.addEventListener('click', () => {
    const tag = btn.dataset.filter;
    filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    document.querySelectorAll('[data-tags]').forEach((card) => {
      card.hidden = tag !== 'all' && !card.dataset.tags.split(' ').includes(tag);
      if (!card.hidden) card.classList.add('is-visible');
    });
  }));

  // Contact form: hand the message to the visitor's email app.
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name')).trim();
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${String(data.get('message')).trim()}\n\n${name}\n${data.get('email')}`);
      const note = form.querySelector('[data-form-note]');
      if (note) note.textContent = 'Opening your email app. If nothing happens, write to poudel.avik91@gmail.com.';
      window.location.href = `mailto:poudel.avik91@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Back-to-top button
  const toTop = document.querySelector('[data-to-top]');
  if (toTop) {
    // Hidden near the top of the page and while the footer is on screen.
    const footer = document.querySelector('.site-footer');
    let footerVisible = false;
    const show = () => toTop.classList.toggle('is-visible', window.scrollY > 700 && !footerVisible);
    if (hasIO && footer) {
      new IntersectionObserver(([entry]) => { footerVisible = entry.isIntersecting; show(); }).observe(footer);
    }
    show();
    window.addEventListener('scroll', show, { passive: true });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    });
  }
})();
