import { aboutContent, aboutStats, profile } from './data/profile.js';
import { skillCategories } from './data/skills.js';
import { projects } from './data/projects.js';
import { experience } from './data/experience.js';

function sectionHeader(title, subtitle) {
  return `
    <div class="section-header">
      <h2 class="section-header__title">${title}</h2>
      <p class="section-header__subtitle">${subtitle}</p>
    </div>
  `;
}

function renderAbout() {
  const stats = aboutStats
    .map(
      (stat) => `
      <div class="stat-card glass-card">
        <span class="stat-card__value">${stat.value}</span>
        <span class="stat-card__label">${stat.label}</span>
      </div>
    `
    )
    .join('');

  const paragraphs = aboutContent.paragraphs
    .map((p) => `<p class="about__text">${p}</p>`)
    .join('');

  return `
    <section id="about" class="section about">
      <div class="container">
        ${sectionHeader(aboutContent.title, aboutContent.subtitle)}
        <div class="about__grid">
          <div class="about__content glass-card">
            ${paragraphs}
          </div>
          <div class="about__stats">${stats}</div>
        </div>
      </div>
    </section>
  `;
}

function renderSkills() {
  const cards = skillCategories
    .map(
      (cat) => `
      <article class="skill-card glass-card" data-category="${cat.id}">
        <div class="skill-card__header">
          <span class="skill-card__icon" aria-hidden="true">${cat.icon}</span>
          <h3 class="skill-card__title">${cat.title}</h3>
        </div>
        <ul class="skill-card__list">
          ${cat.skills.map((s) => `<li class="skill-card__item">${s}</li>`).join('')}
        </ul>
      </article>
    `
    )
    .join('');

  return `
    <section id="skills" class="section skills">
      <div class="container">
        ${sectionHeader('Навыки', 'Технологии и инструменты, с которыми работаю')}
        <div class="skills__grid">${cards}</div>
      </div>
    </section>
  `;
}

function renderProjects() {
  const cards = projects
    .map((project) => {
      const tags = project.technologies
        .map((t) => `<span class="project-card__tag">${t}</span>`)
        .join('');

      return `
        <article class="project-card glass-card ${project.featured ? 'project-card--featured' : ''}">
          <a href="${project.detailPage}" class="project-card__image-link">
            <div class="project-card__image">
              <img src="${project.image}" alt="${project.title}" loading="lazy" />
            </div>
          </a>
          <div class="project-card__body">
            <span class="project-card__label">Featured Project</span>
            <h3 class="project-card__title">${project.title}</h3>
            <p class="project-card__subtitle">${project.subtitle}</p>
            <p class="project-card__description">${project.description}</p>
            <div class="project-card__tags">${tags}</div>
            <div class="project-card__actions">
              <a href="${project.detailPage}" class="btn btn--ghost btn--sm">Подробнее</a>
              <a href="${project.github}" class="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  return `
    <section id="projects" class="section projects">
      <div class="container">
        ${sectionHeader('Проекты', 'Реальные проекты с акцентом на backend и 3D')}
        <div class="projects__grid">${cards}</div>
      </div>
    </section>
  `;
}

function renderExperience() {
  const items = experience
    .map(
      (item) => `
      <div class="timeline__item ${item.highlight ? 'timeline__item--highlight' : ''}">
        <div class="timeline__marker"></div>
        <div class="timeline__content glass-card">
          <time class="timeline__year">${item.year}</time>
          <h3 class="timeline__title">${item.title}</h3>
          <p class="timeline__description">${item.description}</p>
        </div>
      </div>
    `
    )
    .join('');

  return `
    <section id="experience" class="section experience">
      <div class="container">
        ${sectionHeader('Опыт', 'Мой путь в разработке')}
        <div class="timeline">${items}</div>
      </div>
    </section>
  `;
}

function renderContact() {
  const telegramLink = profile.telegram
    ? `<a href="${profile.telegram}" class="contact-card glass-card" target="_blank" rel="noopener noreferrer">
         <span class="contact-card__icon">✈</span>
         <span class="contact-card__label">${profile.telegramUsername ?? 'Telegram'}</span>
       </a>`
    : `<div class="contact-card glass-card contact-card--disabled" title="Ссылка скоро будет добавлена">
         <span class="contact-card__icon">✈</span>
         <span class="contact-card__label">Telegram</span>
         <span class="contact-card__hint">Скоро</span>
       </div>`;

  return `
    <section id="contact" class="section contact">
      <div class="container">
        ${sectionHeader('Контакты', 'Свяжитесь со мной')}
        <div class="contact__grid">
          ${telegramLink}
          <a href="${profile.github}" class="contact-card glass-card" target="_blank" rel="noopener noreferrer">
            <span class="contact-card__icon">⌘</span>
            <span class="contact-card__label">GitHub</span>
          </a>
          <a href="mailto:${profile.email}" class="contact-card glass-card">
            <span class="contact-card__icon">@</span>
            <span class="contact-card__label">${profile.email}</span>
          </a>
          <a href="${profile.resumePath}" class="contact-card glass-card" download="Bogdan_Sikorsky_Resume.pdf">
            <span class="contact-card__icon">↓</span>
            <span class="contact-card__label">Resume</span>
          </a>
        </div>
      </div>
    </section>
  `;
}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="container footer__inner">
        <p class="footer__copy">© ${new Date().getFullYear()} ${profile.name}</p>
        <p class="footer__note">Built with HTML, CSS, JavaScript & Three.js</p>
      </div>
    </footer>
  `;
}

export function renderSections() {
  const root = document.getElementById('sections-root');
  if (!root) return;

  root.innerHTML =
    renderAbout() +
    renderSkills() +
    renderProjects() +
    renderExperience() +
    renderContact() +
    renderFooter();
}

export function initSkillCards() {
  document.querySelectorAll('.skill-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}
