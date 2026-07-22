export function initNavigation() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const linksContainer = nav?.querySelector('.nav__links');
  const links = nav?.querySelectorAll('.nav__link') ?? [];

  if (!nav) return;

  function handleScroll() {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
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
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}
