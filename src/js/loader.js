import { loaderSteps } from './data/profile.js';

const STEP_DELAY = 700;
const WELCOME_DELAY = 400;
const EXIT_DELAY = 600;

export function initLoader(onComplete) {
  const loader = document.getElementById('loader');
  const stepsContainer = document.getElementById('loader-steps');
  const progressBar = document.getElementById('loader-progress');
  const welcome = document.getElementById('loader-welcome');
  const app = document.getElementById('app');

  if (!loader || !stepsContainer) {
    onComplete?.();
    return;
  }

  document.body.classList.add('loader-active');

  const stepElements = loaderSteps.map((text) => {
    const el = document.createElement('p');
    el.className = 'loader__step';
    el.textContent = text;
    stepsContainer.appendChild(el);
    return el;
  });

  let currentStep = 0;

  function updateProgress() {
    const progress = ((currentStep + 1) / loaderSteps.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function showStep(index) {
    stepElements.forEach((el, i) => {
      if (i < index) {
        el.classList.add('loader__step--visible', 'loader__step--done');
        el.classList.remove('loader__step--active');
      } else if (i === index) {
        el.classList.add('loader__step--visible', 'loader__step--active');
        el.classList.remove('loader__step--done');
      }
    });
    updateProgress();
  }

  function finishLoader() {
    stepElements.forEach((el) => {
      el.classList.add('loader__step--visible', 'loader__step--done');
      el.classList.remove('loader__step--active');
    });
    progressBar.style.width = '100%';

    welcome?.classList.add('loader__welcome--visible');

    setTimeout(() => {
      loader.classList.add('loader--exit');
      loader.setAttribute('aria-hidden', 'true');
      app?.classList.remove('app--hidden');
      document.body.classList.remove('loader-active');

      setTimeout(() => {
        loader.remove();
        onComplete?.();
      }, EXIT_DELAY);
    }, WELCOME_DELAY);
  }

  function nextStep() {
    if (currentStep >= loaderSteps.length) {
      finishLoader();
      return;
    }

    showStep(currentStep);
    currentStep += 1;

    setTimeout(nextStep, STEP_DELAY);
  }

  requestAnimationFrame(() => {
    setTimeout(nextStep, 300);
  });
}
