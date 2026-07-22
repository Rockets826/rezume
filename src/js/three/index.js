let heroScene = null;

function isSceneSupported() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia('(max-width: 768px)').matches) return false;
  return true;
}

export async function initThreeBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || heroScene || !isSceneSupported()) return;

  const { initHeroScene } = await import('./scene.js');
  heroScene = initHeroScene(canvas);
}

export function destroyThreeBackground() {
  heroScene?.destroy();
  heroScene = null;
}
