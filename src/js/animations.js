const DEFAULT_EASE = 'power3.out';

function isAnimationEnabled() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollTriggerConfig(trigger, start = 'top 85%') {
  return {
    trigger,
    start,
    toggleActions: 'play none none none',
  };
}

function animateSectionHeaders(gsap) {
  document.querySelectorAll('.section-header').forEach((header) => {
    gsap.from(header.querySelectorAll('.section-header__title, .section-header__subtitle'), {
      y: 36,
      opacity: 0,
      duration: 0.85,
      stagger: 0.1,
      ease: DEFAULT_EASE,
      scrollTrigger: scrollTriggerConfig(header),
    });
  });
}

function animateAbout(gsap) {
  const grid = document.querySelector('.about__grid');
  if (!grid) return;

  gsap.from(grid.querySelector('.about__content'), {
    x: -30,
    opacity: 0,
    duration: 0.85,
    ease: DEFAULT_EASE,
    clearProps: 'transform',
    scrollTrigger: scrollTriggerConfig(grid),
  });

  gsap.from(grid.querySelectorAll('.stat-card'), {
    y: 28,
    opacity: 0,
    duration: 0.65,
    stagger: 0.1,
    ease: DEFAULT_EASE,
    clearProps: 'transform',
    scrollTrigger: scrollTriggerConfig(grid),
  });
}

function animateSkills(gsap) {
  const grid = document.querySelector('.skills__grid');
  if (!grid) return;

  gsap.from(grid.querySelectorAll('.skill-card'), {
    y: 40,
    opacity: 0,
    duration: 0.75,
    stagger: 0.1,
    ease: DEFAULT_EASE,
    clearProps: 'transform',
    scrollTrigger: scrollTriggerConfig(grid, 'top 88%'),
  });
}

function animateProjects(gsap) {
  const card = document.querySelector('.project-card');
  if (!card) return;

  gsap.from(card.querySelector('.project-card__image'), {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: DEFAULT_EASE,
    scrollTrigger: scrollTriggerConfig(card),
  });

  gsap.from(
    card.querySelectorAll(
      '.project-card__label, .project-card__title, .project-card__subtitle, .project-card__description, .project-card__tags, .project-card__actions'
    ),
    {
      y: 32,
      opacity: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: DEFAULT_EASE,
      scrollTrigger: scrollTriggerConfig(card, 'top 80%'),
    }
  );
}

function animateExperience(gsap) {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  gsap.from(timeline.querySelectorAll('.timeline__item'), {
    x: -36,
    opacity: 0,
    duration: 0.8,
    stagger: 0.14,
    ease: DEFAULT_EASE,
    scrollTrigger: scrollTriggerConfig(timeline, 'top 85%'),
  });

  gsap.from(timeline.querySelectorAll('.timeline__marker'), {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: 0.14,
    ease: 'back.out(2)',
    scrollTrigger: scrollTriggerConfig(timeline, 'top 85%'),
  });
}

function animateContact(gsap) {
  const grid = document.querySelector('.contact__grid');
  if (!grid) return;

  gsap.from(grid.querySelectorAll('.contact-card'), {
    y: 32,
    opacity: 0,
    duration: 0.65,
    stagger: 0.08,
    ease: DEFAULT_EASE,
    clearProps: 'transform',
    scrollTrigger: scrollTriggerConfig(grid, 'top 88%'),
  });
}

function animateFooter(gsap) {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  gsap.from(footer.querySelectorAll('.footer__copy, .footer__note'), {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: DEFAULT_EASE,
    scrollTrigger: scrollTriggerConfig(footer, 'top 95%'),
  });
}

export async function initScrollAnimations() {
  if (!isAnimationEnabled()) return;

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);

  gsap.registerPlugin(ScrollTrigger);

  animateSectionHeaders(gsap);
  animateAbout(gsap);
  animateSkills(gsap);
  animateProjects(gsap);
  animateExperience(gsap);
  animateContact(gsap);
  animateFooter(gsap);

  ScrollTrigger.refresh();
}

export async function refreshScrollAnimations() {
  if (!isAnimationEnabled()) return;

  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  ScrollTrigger.refresh();
}
