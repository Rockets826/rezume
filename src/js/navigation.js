const NAV_OFFSET = 80;

export function initNavigation() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const linksContainer = nav?.querySelector('.nav__links');
  const links = nav?.querySelectorAll('.nav__link') ?? [];
  const sections = document.querySelectorAll('section[id]');

  if (!nav) return;

  function handleScroll() {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
    updateActiveLink();
  }

  function updateActiveLink() {
    let current = '';

    sections.forEach((section) => {
      const top = section.offsetTop - NAV_OFFSET;
      if (window.scrollY >= top) {
        current = section.getAttribute('id') ?? '';
      }
    });

    links.forEach((link) => {
      const href = link.getAttribute('href')?.slice(1);
      link.classList.toggle('nav__link--active', href === current);
    });
  }

  function closeMobileMenu() {
    burger?.classList.remove('nav__burger--open');
    linksContainer?.classList.remove('nav__links--open');
    burger?.setAttribute('aria-expanded', 'false');
  }

  burger?.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('nav__burger--open');
    linksContainer?.classList.toggle('nav__links--open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      scrollToHash(link.getAttribute('href'), e);
      closeMobileMenu();
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (link.closest('.nav__links') || link.classList.contains('nav__logo')) return;
    link.addEventListener('click', (e) => scrollToHash(link.getAttribute('href'), e));
  });

  document.querySelector('.nav__logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();
  });

  function scrollToHash(hash, e) {
    if (!hash?.startsWith('#') || hash.length < 2) return;
    e?.preventDefault();
    const target = document.querySelector(hash);
    if (target) {
      const top = target.offsetTop - NAV_OFFSET + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}
