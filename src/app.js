import { initLoader } from './js/loader.js';
import { initNavigation } from './js/navigation.js';
import { renderSections, initSkillCards } from './js/sections.js';
import { initThreeBackground } from './js/three/index.js';
import { initScrollAnimations, refreshScrollAnimations } from './js/animations.js';
import { initTerminal } from './js/terminal.js';
import { initHero } from './js/hero.js';
import { initGitHubBlock } from './js/github.js';

export function initApp() {
  renderSections();
  initHero();

  initLoader(async () => {
    initNavigation();
    initSkillCards();
    initTerminal();
    await initScrollAnimations();
    void initThreeBackground();
    void initGitHubBlock();
    await refreshScrollAnimations();
  });
}
