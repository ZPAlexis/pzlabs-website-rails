import { Animations } from './animations.js';
import { ButtonManager } from './buttons.js';

const CommonInit = {
  init() {
      Animations.initScrollReveals();
      ButtonManager.init();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CommonInit.init();
});