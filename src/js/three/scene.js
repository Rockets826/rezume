import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  GridHelper,
  IcosahedronGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from 'three';

const ACCENT = 0x3b82f6;
const ACCENT_2 = 0x6366f1;
const MOUSE_LERP = 0.04;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

function isSceneSupported() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia('(max-width: 768px)').matches) return false;
  return true;
}

function createParticles(count) {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorA = new Color(ACCENT);
  const colorB = new Color(ACCENT_2);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = 4 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const mix = Math.random();
    const color = colorA.clone().lerp(colorB, mix);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  const material = new PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
    depthWrite: false,
  });

  return new Points(geometry, material);
}

function createWireframeShape(geometry, color, opacity = 0.35) {
  const material = new MeshBasicMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity,
  });
  return new Mesh(geometry, material);
}

export function initHeroScene(canvas) {
  if (!canvas || !isSceneSupported()) return null;

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 9;

  const sceneGroup = new Group();
  scene.add(sceneGroup);

  const particleCount = window.innerWidth > 1200 ? 1400 : 800;
  const particles = createParticles(particleCount);
  sceneGroup.add(particles);

  const icosahedron = createWireframeShape(new IcosahedronGeometry(2.2, 1), ACCENT, 0.28);
  icosahedron.position.set(-2.2, 0.6, -1);
  sceneGroup.add(icosahedron);

  const torus = createWireframeShape(new TorusGeometry(1.6, 0.04, 8, 48), ACCENT_2, 0.22);
  torus.position.set(2.2, -0.6, -1);
  torus.rotation.x = Math.PI * 0.35;
  sceneGroup.add(torus);

  const grid = new GridHelper(24, 32, ACCENT, ACCENT_2);
  grid.material.transparent = true;
  grid.material.opacity = 0.06;
  grid.position.y = -3.5;
  grid.rotation.x = Math.PI * 0.08;
  sceneGroup.add(grid);

  const heroBg = canvas.parentElement;
  const heroSection = heroBg?.closest('.hero') ?? heroBg;
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let animationId = null;
  let lastFrameTime = 0;
  let paused = false;
  let visible = true;
  let destroyed = false;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;
    if (width === 0 || height === 0) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function onPointerMove(e) {
    const rect = heroSection.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouse.targetX = MathUtils.clamp(x * 2 - 1, -1, 1);
    mouse.targetY = MathUtils.clamp(y * 2 - 1, -1, 1);
  }

  function onPointerLeave() {
    mouse.targetX = 0;
    mouse.targetY = 0;
  }

  function onVisibilityChange() {
    paused = document.hidden;
  }

  function animate(time) {
    if (destroyed) return;
    animationId = requestAnimationFrame(animate);

    if (paused || !visible) return;

    if (time - lastFrameTime < FRAME_INTERVAL) return;
    lastFrameTime = time;

    mouse.x += (mouse.targetX - mouse.x) * MOUSE_LERP;
    mouse.y += (mouse.targetY - mouse.y) * MOUSE_LERP;

    const t = time * 0.0003;

    particles.rotation.y = t * 0.4;
    particles.rotation.x = Math.sin(t * 0.5) * 0.05;

    icosahedron.rotation.x = t * 0.8;
    icosahedron.rotation.y = t * 1.1;
    icosahedron.position.y = 0.6 + Math.sin(t * 1.5) * 0.15;

    torus.rotation.z = t * 0.6;
    torus.rotation.y = t * 0.4;

    sceneGroup.rotation.y = mouse.x * 0.12;
    sceneGroup.rotation.x = mouse.y * 0.08;
    camera.position.x = mouse.x * 0.5;
    camera.position.y = -mouse.y * 0.35;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  heroSection.addEventListener('pointermove', onPointerMove, { passive: true });
  heroSection.addEventListener('pointerleave', onPointerLeave, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { threshold: 0.05 }
  );
  observer.observe(canvas.parentElement);

  canvas.classList.add('hero-canvas--active');
  animationId = requestAnimationFrame(animate);

  return {
    destroy() {
      destroyed = true;
      if (animationId) cancelAnimationFrame(animationId);

      window.removeEventListener('resize', resize);
      heroSection.removeEventListener('pointermove', onPointerMove);
      heroSection.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer.disconnect();

      particles.geometry.dispose();
      particles.material.dispose();
      icosahedron.geometry.dispose();
      icosahedron.material.dispose();
      torus.geometry.dispose();
      torus.material.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      renderer.dispose();

      canvas.classList.remove('hero-canvas--active');
    },
  };
}
