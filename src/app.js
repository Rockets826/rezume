import { initLoader } from './js/loader.js';
import { initNavigation } from './js/navigation.js';
import { renderSections, initSkillCards } from './js/sections.js';
import { initThreeBackground } from './js/three/index.js';
import { initScrollAnimations, refreshScrollAnimations } from './js/animations.js';
import { initTerminal } from './js/terminal.js';

export function initApp() {
  renderSections();

  initLoader(async () => {
    initNavigation();
    initSkillCards();
    initTerminal();
    await initScrollAnimations();
    void initThreeBackground();
    await refreshScrollAnimations();
  });
}
