import { Animations } from 'logic/animations';
import { ButtonManager } from 'logic/buttons';

const CommonInit = {
  init() {
      Animations.initScrollReveals();
      ButtonManager.init();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CommonInit.init();
});