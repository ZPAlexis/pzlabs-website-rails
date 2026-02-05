import { Elements } from './uiElements.js';

export const Animations = {
  initScrollReveals() {
    const revealConfigs = [
      { selector: '.fade-up', threshold: 0.1, className: 'fade-up' },
      { selector: '.fade-left', threshold: 0.5, className: 'fade-left' },
      { selector: '.fade-right', threshold: 0.5, className: 'fade-right' }
    ];

    revealConfigs.forEach(config => {
      const targets = document.querySelectorAll(config.selector);
      if (targets.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('visible');

            const handleTransitionEnd = (e) => {
              if (e.target === el && (e.propertyName === 'transform' || e.propertyName === 'opacity')) {
                el.classList.remove(config.className, 'visible');
                el.removeEventListener('transitionend', handleTransitionEnd);
              }
            };

            el.addEventListener('transitionend', handleTransitionEnd);
            observer.unobserve(el);
          }
        });
      }, { threshold: config.threshold });

      targets.forEach(target => observer.observe(target));
    });
  },
  
  restart(el, className) {
    if (!el) return;
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  },

  highlightSummaryCoinContainer() {
      this.restart(Elements.summaryCoinContainer, 'highlight');
  },

  fadeUpdate(element, newHTML) {
    return new Promise((resolve) => {
      if (!element) return resolve();

      element.classList.add('hidden');

      const handler = (e) => {
        if (e.target !== element) return;

        element.innerHTML = newHTML;

        void element.offsetWidth;

        element.classList.remove('hidden');

        element.removeEventListener('transitionend', handler);
        resolve();
      };

      const style = window.getComputedStyle(element);
      if (style.transitionDuration === '0s' || style.opacity === '0') {
        element.innerHTML = newHTML;
        element.classList.remove('hidden');
        return resolve();
      }

      element.addEventListener('transitionend', handler);
    });
  },

  coinStaticSrc: 'icons/coin-gold.svg',
  coinSpinSrc: 'icons/coin_spin.gif',
  coinIdleSrc: 'icons/coin_idle.gif',
  coinGifDuration: 3000,

  playIdleCoinSpin(idleEl, spinEl, onComplete) {
    spinEl.src = '';
    spinEl.style.opacity = '1';
    spinEl.src = this.coinSpinSrc;
    idleEl.style.opacity = '0';

    setTimeout(() => {
      idleEl.src = this.coinIdleSrc;
      idleEl.style.opacity = '1';
      spinEl.style.opacity = '0';
      if (onComplete) onComplete();
    }, this.coinGifDuration);
  },
  
  playCoinSpin(el, onComplete) {
    if (!el) return;

    el.src = ''; 
    void el.offsetWidth;
    el.src = this.coinSpinSrc;

    setTimeout(() => {
      el.src = this.coinStaticSrc;
      if (onComplete) onComplete();
    }, this.coinGifDuration);
  },
};