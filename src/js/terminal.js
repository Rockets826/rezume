import { profile, aboutContent } from './data/profile.js';
import { skillCategories } from './data/skills.js';
import { projects } from './data/projects.js';

const PROMPT = `<span class="terminal__prompt-user">bogdan</span><span class="terminal__prompt-at">@</span><span class="terminal__prompt-host">portfolio</span><span class="terminal__prompt-symbol">:~$</span>`;
const NAV_OFFSET = 80;

const COMMANDS = ['help', 'about', 'skills', 'projects', 'github', 'telegram', 'resume', 'clear'];

export function initTerminal() {
  const toggle = document.getElementById('terminal-toggle');
  const panel = document.getElementById('terminal');
  const closeBtn = document.getElementById('terminal-close');
  const closeBtnAlt = document.getElementById('terminal-close-btn');
  const output = document.getElementById('terminal-output');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');

  if (!toggle || !panel || !output || !form || !input) return;

  let history = [];
  let historyIndex = -1;
  let isOpen = false;

  function print(content, className = '') {
    const line = document.createElement('div');
    line.className = `terminal__line ${className}`.trim();
    line.innerHTML = content;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function printCommand(cmd) {
    print(`${PROMPT} ${escapeHtml(cmd)}`, 'terminal__line--command');
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.offsetTop - NAV_OFFSET + 1;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function openTerminal() {
    isOpen = true;
    panel.classList.add('terminal--open');
    panel.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function closeTerminal() {
    isOpen = false;
    panel.classList.remove('terminal--open');
    panel.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }

  function toggleTerminal() {
    if (isOpen) closeTerminal();
    else openTerminal();
  }

  function showWelcome() {
    print('Добро пожаловать в интерактивный терминал портфолио.');
    print('Введите <span class="terminal__accent">help</span> для списка команд.');
  }

  function cmdHelp() {
    print('<span class="terminal__accent">Доступные команды:</span>');
    print('  help      — список команд');
    print('  about     — информация обо мне');
    print('  skills    — технологии и навыки');
    print('  projects  — мои проекты');
    print('  github    — открыть GitHub');
    print('  telegram  — открыть Telegram');
    print('  resume    — скачать резюме');
    print('  clear     — очистить терминал');
  }

  function cmdAbout() {
    print(`<span class="terminal__accent">${profile.name}</span>`);
    print(profile.role);
    aboutContent.paragraphs.forEach((p) => print(p));
    scrollToSection('about');
  }

  function cmdSkills() {
    skillCategories.forEach((cat) => {
      print(`<span class="terminal__accent">${cat.title}:</span> ${cat.skills.join(', ')}`);
    });
    scrollToSection('skills');
  }

  function cmdProjects() {
    projects.forEach((p) => {
      print(`<span class="terminal__accent">${p.title}</span> — ${p.subtitle}`);
      print(`  ${p.technologies.join(' · ')}`);
      print(`  <span class="terminal__muted">${p.github}</span>`);
    });
    scrollToSection('projects');
  }

  function cmdGithub() {
    print(`Opening GitHub: ${profile.github}`);
    window.open(profile.github, '_blank', 'noopener,noreferrer');
  }

  function cmdTelegram() {
    if (!profile.telegram) return;
    print(`Opening Telegram: ${profile.telegramUsername ?? profile.telegram}`);
    window.open(profile.telegram, '_blank', 'noopener,noreferrer');
    scrollToSection('contact');
  }

  function cmdResume() {
    print('Downloading resume...');
    const link = document.createElement('a');
    link.href = profile.resumePath;
    link.download = 'Bogdan_Sikorsky_Resume.pdf';
    link.click();
  }

  function cmdEasterEgg() {
    print('<span class="terminal__success">Permission granted.</span>');
    print('<span class="terminal__success">Welcome to the team.</span>');
  }

  function cmdUnknown(cmd) {
    print(`Команда не найдена: <span class="terminal__error">${escapeHtml(cmd)}</span>`);
    print('Введите <span class="terminal__accent">help</span> для списка команд.');
  }

  function executeCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    printCommand(raw.trim());

    if (cmd === 'sudo hire bogdan') {
      cmdEasterEgg();
      return;
    }

    switch (cmd) {
      case 'help':
        cmdHelp();
        break;
      case 'about':
        cmdAbout();
        break;
      case 'skills':
        cmdSkills();
        break;
      case 'projects':
        cmdProjects();
        break;
      case 'github':
        cmdGithub();
        break;
      case 'telegram':
        cmdTelegram();
        break;
      case 'resume':
        cmdResume();
        break;
      case 'clear':
        output.innerHTML = '';
        showWelcome();
        break;
      default:
        cmdUnknown(cmd);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    history.push(value);
    historyIndex = history.length;
    executeCommand(value);
    input.value = '';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex -= 1;
        input.value = history[historyIndex];
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex += 1;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const value = input.value.trim().toLowerCase();
      const match = COMMANDS.find((c) => c.startsWith(value));
      if (match) input.value = match;
    }

    if (e.key === 'Escape') {
      closeTerminal();
    }
  });

  toggle.addEventListener('click', toggleTerminal);
  closeBtn?.addEventListener('click', closeTerminal);
  closeBtnAlt?.addEventListener('click', closeTerminal);

  document.addEventListener('keydown', (e) => {
    if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        if (document.activeElement !== input) return;
      }
      e.preventDefault();
      toggleTerminal();
    }
  });

  showWelcome();
}
