import { buttonActions } from './actions.js';
import { mobileNavSelect } from './mobile-nav.js';

export const ButtonManager = {
  init() {
    this.setupAnimatedButtons();
    this.setupMobileNav();
    this.setupDropdownMenus();
    this.setupScrollToTop();
  },

  setupAnimatedButtons() {
    const buttons = document.querySelectorAll('.js-animated-button');

    buttons.forEach((button) => {
      const handlePressStart = () => {
        if (button.disabled) return;
        button.classList.remove('highlight')
        button.style.setProperty('transition', 'none');
        button.classList.add('pressed');

        const handlePressEnd = () => {
          button.style.setProperty('transition', 'var(--btn-transition)');
          button.classList.remove('pressed');
          window.removeEventListener('pointerup', handlePressEnd);
          window.removeEventListener('pointercancel', handlePressEnd);

          this.executeAction(button);
        };

        window.addEventListener('pointerup', handlePressEnd);
        window.addEventListener('pointercancel', handlePressEnd);
      };

      button.addEventListener('pointerdown', handlePressStart);
    });
  },

  setupMobileNav() {
    const mobileNavButtons = document.querySelectorAll('.js-mobile-nav-button');
    mobileNavButtons.forEach((button) => {
      button.addEventListener('pointerdown', () => {
        if (button.disabled) return;
        mobileNavSelect(button);
        this.executeAction(button);
      });
    });
  },

  setupDropdownMenus() {
    const menuContainers = document.querySelectorAll('.js-header-menu');

    const closeAll = (except = null) => {
      menuContainers.forEach(container => {
        const drawer = container.querySelector('.js-header-drawer');
        const button = container.querySelector('.js-menu-toggle');
        if (drawer && drawer !== except) {
          drawer.classList.remove('active');
          button?.setAttribute('aria-expanded', 'false');
        }
      });
    };

    const handleOutsideClick = (e) => {
      if (!e.target.closest('.js-header-menu')) {
        closeAll();
        document.removeEventListener('click', handleOutsideClick);
      }
    };

    menuContainers.forEach(container => {
      const toggleButton = container.querySelector('.js-menu-toggle');
      const drawer = container.querySelector('.js-header-drawer');

      if (!toggleButton || !drawer) return;

      toggleButton.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = drawer.classList.toggle('active');
        toggleButton.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
          closeAll(drawer);
          document.addEventListener('click', handleOutsideClick);
        } else {
          document.removeEventListener('click', handleOutsideClick);
        }
      });

      drawer.addEventListener('click', e => {
        if (e.target.closest('button')) {
          closeAll();
          document.removeEventListener('click', handleOutsideClick);
        }
      });
    });
  },

  setupScrollToTop() {
    const btn = document.querySelector('.js-return-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        btn.classList.toggle('hidden', window.scrollY <= 600);
      });
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  executeAction(button) {
    const actionType = button.dataset.action;
    const action = buttonActions[actionType];

    if (typeof action === 'function') {
      action(button);
    } else if (actionType) {
      console.warn(`No action found for type "${actionType}"`);
    }
  }
};