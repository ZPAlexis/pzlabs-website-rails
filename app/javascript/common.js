import { Animations } from 'logic/animations';
import { ButtonManager } from 'logic/buttons';
import { fetchAndDisplayMetrics } from 'logic/api';

const CommonInit = {
  init() {
      Animations.initScrollReveals();
      ButtonManager.init();
      if (document.querySelector('.api-total-coins')) fetchAndDisplayMetrics();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CommonInit.init();
});