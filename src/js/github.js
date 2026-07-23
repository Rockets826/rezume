import { profile, pinnedRepos } from './data/profile.js';

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Blade: '#f75238',
};

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getLanguageColor(lang) {
  return LANG_COLORS[lang] ?? '#3b82f6';
}

function renderSkeleton() {
  const block = document.getElementById('github-block');
  if (!block) return;
  block.innerHTML = `
    <div class="github-stats">
      ${Array.from({ length: 4 }).map(() => '<div class="github-stat glass-card github-stat--loading"></div>').join('')}
    </div>
    <div class="github-repos github-repos--loading">
      ${Array.from({ length: 3 }).map(() => '<div class="github-repo glass-card"></div>').join('')}
    </div>
  `;
}

function renderError(message) {
  const block = document.getElementById('github-block');
  if (!block) return;
  block.innerHTML = `
    <p class="github-error">${message}</p>
    <a href="${profile.github}" class="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer">Открыть GitHub</a>
  `;
}

function buildLanguageStats(repos) {
  const counts = {};
  repos.forEach((repo) => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    }
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

function renderGitHubBlock(data) {
  const block = document.getElementById('github-block');
  if (!block) return;

  const { user, repos, events, languages } = data;

  const pinned = pinnedRepos
    .map((name) => repos.find((r) => r.name === name))
    .filter(Boolean);
  const displayRepos = pinned.length ? pinned : repos.slice(0, 4);

  const langBars = languages
    .map(
      ([lang, count]) => `
      <div class="github-lang">
        <span class="github-lang__dot" style="background:${getLanguageColor(lang)}"></span>
        <span class="github-lang__name">${lang}</span>
        <span class="github-lang__count">${count}</span>
      </div>
    `
    )
    .join('');

  const repoCards = displayRepos
    .map(
      (repo) => `
      <a href="${repo.html_url}" class="github-repo glass-card" target="_blank" rel="noopener noreferrer">
        <div class="github-repo__head">
          <span class="github-repo__name">${repo.name}</span>
          ${repo.language ? `<span class="github-repo__lang">${repo.language}</span>` : ''}
        </div>
        <p class="github-repo__desc">${repo.description ?? 'Репозиторий без описания'}</p>
        <div class="github-repo__meta">
          <span>★ ${repo.stargazers_count}</span>
          <span>Обновлён ${formatDate(repo.pushed_at)}</span>
        </div>
      </a>
    `
    )
    .join('');

  const eventItems = events
    .slice(0, 4)
    .map((event) => {
      const type = event.type?.replace('Event', '') ?? 'Activity';
      const repo = event.repo?.name ?? '';
      return `<li class="github-event"><span class="github-event__type">${type}</span> · ${repo} · ${formatDate(event.created_at)}</li>`;
    })
    .join('');

  block.innerHTML = `
    <div class="github-stats">
      <div class="github-stat glass-card">
        <span class="github-stat__value">${user.public_repos}</span>
        <span class="github-stat__label">репозиториев</span>
      </div>
      <div class="github-stat glass-card">
        <span class="github-stat__value">${user.followers}</span>
        <span class="github-stat__label">подписчиков</span>
      </div>
      <div class="github-stat glass-card">
        <span class="github-stat__value">${repos.reduce((s, r) => s + r.stargazers_count, 0)}</span>
        <span class="github-stat__label">звёзд</span>
      </div>
      <div class="github-stat glass-card">
        <span class="github-stat__value">${languages.length}</span>
        <span class="github-stat__label">языков</span>
      </div>
    </div>

    <div class="github-layout">
      <div class="github-layout__main">
        <h3 class="github-subtitle">Закреплённые проекты</h3>
        <div class="github-repos">${repoCards}</div>
      </div>
      <aside class="github-layout__side">
        <div class="github-panel glass-card">
          <h3 class="github-subtitle">Языки</h3>
          <div class="github-langs">${langBars || '<p class="github-muted">Нет данных</p>'}</div>
        </div>
        <div class="github-panel glass-card">
          <h3 class="github-subtitle">Последняя активность</h3>
          <ul class="github-events">${eventItems || '<li class="github-muted">Нет событий</li>'}</ul>
        </div>
      </aside>
    </div>
  `;
}

export async function initGitHubBlock() {
  const block = document.getElementById('github-block');
  if (!block) return;

  renderSkeleton();

  try {
    const username = profile.githubUsername;
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=8`),
    ]);

    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API недоступен');

    const user = await userRes.json();
    const repos = await reposRes.json();
    const events = eventsRes.ok ? await eventsRes.json() : [];
    const languages = buildLanguageStats(repos);

    renderGitHubBlock({ user, repos, events, languages });
  } catch {
    renderError('Не удалось загрузить данные GitHub. Перейдите на профиль напрямую.');
  }
}
