import { profile } from './data/profile.js';

export function initHero() {
  const tagline = document.getElementById('hero-tagline');
  if (tagline && profile.tagline) {
    tagline.textContent = profile.tagline;
  }
}
