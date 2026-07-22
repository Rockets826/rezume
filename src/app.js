import { initLoader } from './js/loader.js';
import { initNavigation } from './js/navigation.js';

export function initApp() {
  initLoader(() => {
    initNavigation();
  });
}
