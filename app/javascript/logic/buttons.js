import { buttonActions } from 'logic/actions';
import { mobileNavSelect, positionNavIndicator } from 'logic/mobile-nav';
import { setupImageLightbox } from 'logic/lightbox';

export const ButtonManager = {
  init() {
    this.setupButtons();
    this.setupAnimatedButtons();
    this.setupMobileNav();
    this.setupDropdownMenus();
    this.setupScrollToTop();
    this.setupSectionNav();
    setupImageLightbox();
  },

  setupButtons() {
    const buttons = document.querySelectorAll('.js-button');

    buttons.forEach((button) => {
      button.addEventListener('pointerdown', () => {
        if (button.disabled) return;
        this.executeAction(button);
      });
    });
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
    if (mobileNavButtons.length === 0) return;

    const indicator = document.querySelector('.js-mobile-nav-indicator');
    const activeButton = document.querySelector('.js-mobile-nav-button.active-tab') || mobileNavButtons[0];
    if (indicator) indicator.classList.add('no-transition');
    positionNavIndicator(activeButton);
    if (indicator) {
      requestAnimationFrame(() => indicator.classList.remove('no-transition'));
    }

    mobileNavButtons.forEach((button) => {
      const handlePressStart = () => {
        if (button.disabled) return;
        button.style.setProperty('transition', 'none');
        button.classList.add('pressed');

        const handlePressEnd = () => {
          button.style.setProperty('transition', '');
          button.classList.remove('pressed');
          window.removeEventListener('pointerup', handlePressEnd);
          window.removeEventListener('pointercancel', handlePressEnd);

          mobileNavSelect(button);
          positionNavIndicator(button);
          this.executeAction(button);
        };

        window.addEventListener('pointerup', handlePressEnd);
        window.addEventListener('pointercancel', handlePressEnd);
      };

      button.addEventListener('pointerdown', handlePressStart);
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

  setupSectionNav() {
    const headings = Array.from(document.querySelectorAll('.post-section .post-heading[id]'));
    if (headings.length === 0) return;

    const sections = headings.map((el) => ({ id: el.id, title: el.textContent.trim(), el }));

    const prevBtn = document.querySelector('.js-prev-section');
    const nextBtn = document.querySelector('.js-next-section');
    if (!prevBtn || !nextBtn) return;

    const TOP_OFFSET = 150;
    const HEADER_OFFSET = 60;
    const HIDE_TRANSITION_MS = 300;
    const endMarker = document.querySelector('.post-references-section');
    let currentIndex = -1;
    let pastThreshold = false;

    const setButtonVisible = (btn, visible) => {
      if (visible) {
        clearTimeout(btn._hideTimeout);
        if (btn.style.display === 'none') btn.style.display = '';
        requestAnimationFrame(() => btn.classList.remove('hidden'));
      } else {
        if (btn.classList.contains('hidden')) return;
        btn.classList.add('hidden');
        btn._hideTimeout = setTimeout(() => {
          if (btn.classList.contains('hidden')) btn.style.display = 'none';
        }, HIDE_TRANSITION_MS);
      }
    };

    const scrollToSection = (el) => {
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    const updateCurrentIndex = () => {
      let index = -1;
      sections.forEach((section, i) => {
        if (section.el.getBoundingClientRect().top <= TOP_OFFSET) index = i;
      });
      if (endMarker && endMarker.getBoundingClientRect().top <= TOP_OFFSET) {
        index = sections.length;
      }
      currentIndex = index;
    };

    const updateButtons = () => {
      const prevSection = sections[currentIndex - 1];
      const nextSection = sections[currentIndex + 1];

      prevBtn.querySelector('.js-section-nav-title').textContent = prevSection ? prevSection.title : '';
      nextBtn.querySelector('.js-section-nav-title').textContent = nextSection ? nextSection.title : '';

      setButtonVisible(prevBtn, pastThreshold && !!prevSection);
      setButtonVisible(nextBtn, pastThreshold && !!nextSection);
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        pastThreshold = window.scrollY > 600;
        updateCurrentIndex();
        updateButtons();
      });
    }, { passive: true });

    prevBtn.addEventListener('click', () => {
      const target = sections[currentIndex - 1];
      if (target) scrollToSection(target.el);
    });

    nextBtn.addEventListener('click', () => {
      const target = sections[currentIndex + 1];
      if (target) scrollToSection(target.el);
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