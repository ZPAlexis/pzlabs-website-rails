import { collectFillBarCoin } from './index.js';
import { Animations } from './animations.js';
import { Elements } from './uiElements.js';

export const FillBarGame = {
  bestTimer: parseFloat(localStorage.getItem('bestTimer')) || null,
  lastTimer: parseFloat(localStorage.getItem('lastTimer')) || null,
  timerInterval: null,
  timerStart: null,
  isAnimating: false,
  currentSeconds: "0.00",

  init() {
    this.setupEventListeners();
    this.updateBestDisplay();
    const isCollected = JSON.parse(localStorage.getItem('gameState'))?.fillBar || false;
    this.refreshUI(isCollected);
  },

  setupEventListeners() {
    Elements.resetFillBarButton?.addEventListener('click', () => this.resetUI());
  },

  // --- Core Game Logic ---
  
  increment(amount) {
    const fill = Elements.fillBarFill;
    if (!fill) return;

    const currentWidth = parseFloat(fill.style.width) || 0;
    let newWidth = Math.max(0, Math.min(100, currentWidth + amount));

    const isReachingFull = newWidth === 100 && currentWidth < 100;

    fill.style.width = `${newWidth}%`;

    if (currentWidth === 0 && newWidth > 0) {
      this.startDecay();
      this.startTimer();
    }

    if (isReachingFull) {
      const onTransitionEnd = (e) => {
        if (e.propertyName === 'width') {
          fill.removeEventListener('transitionend', onTransitionEnd);
          collectFillBarCoin();
        }
      };
      fill.addEventListener('transitionend', onTransitionEnd);
    } else if (currentWidth === 100) {
      collectFillBarCoin();
    }
  },

  // --- Timer Logic ---

  startTimer() {
    const fill = Elements.fillBarFill;
    if (!fill) return;

    const handleStart = (e) => {
      if (e.propertyName === 'width') {
        this.timerStart = performance.now();
        this.timerInterval = requestAnimationFrame(() => this.updateTimer());
        Elements.fillTimerCont?.classList.remove('hidden');
        fill.removeEventListener('transitionstart', handleStart);
      }
    };

    const handleEnd = (e) => {
      if (e.propertyName !== 'width') return;
      const width = parseFloat(fill.style.width);

      if (width >= 100) {
        this.stopTimer(true);
        fill.removeEventListener('transitionend', handleEnd);
      } else if (width <= 0) {
        this.stopTimer(false);
        fill.removeEventListener('transitionend', handleEnd);
      }
    };

    fill.addEventListener('transitionstart', handleStart);
    fill.addEventListener('transitionend', handleEnd);
  },

  updateTimer() {
    if (!this.timerInterval) return;
    const elapsed = performance.now() - this.timerStart;
    this.currentSeconds = (elapsed / 1000).toFixed(2);
    
    if (Elements.fillTimerEl) {
      Elements.fillTimerEl.textContent = this.currentSeconds;
    }
    this.timerInterval = requestAnimationFrame(() => this.updateTimer());
  },

  stopTimer(isWin) {
    cancelAnimationFrame(this.timerInterval);
    this.timerInterval = null;

    if (isWin) {
      this.lastTimer = this.currentSeconds;
      localStorage.setItem('lastTimer', this.lastTimer);
      this.checkNewBest();
    } else {
      Elements.fillTimerCont?.classList.add('hidden');
    }
  },

  // --- Decay Logic ---

  async startDecay() {
    const fill = Elements.fillBarFill;
    if (!fill || fill.dataset.decaying === 'true') return;

    fill.dataset.decaying = 'true';

    const decayLoop = () => {
      let currentWidth = parseFloat(fill.style.width) || 0;

      if (currentWidth <= 0 || currentWidth >= 100) {
        delete fill.dataset.decaying;
        return;
      }

      fill.style.width = `${Math.max(0, currentWidth - 0.6)}%`;
      setTimeout(decayLoop, 100);
    };

    decayLoop();
  },

  // --- UI & Storage ---

  checkNewBest() {
    const current = parseFloat(this.currentSeconds);
    const best = this.bestTimer ? parseFloat(this.bestTimer) : Infinity;

    if (current < best) {
      this.bestTimer = this.currentSeconds;
      localStorage.setItem('bestTimer', this.bestTimer);
      this.updateBestDisplay();
    }
  },

  updateBestDisplay() {
    if (Elements.summaryMenuBestTimer && this.bestTimer) {
      Elements.summaryMenuBestTimer.textContent = `${this.bestTimer}s`;
    }
  },

  resetTimers() {
    this.bestTimer = null;
    this.lastTimer = null;
    localStorage.removeItem('bestTimer');
    localStorage.removeItem('lastTimer');
    this.updateBestDisplay();
  },

  refreshUI(collected) {
    if (collected) {
      this.handleCollectedState();
    } else {
      this.handleEmptyState();
    }
  },

  handleCollectedState() {
    if (Elements.fillBarFill) {
      Elements.fillBarFill.style.width = '100%';
    }

    Elements.toggle(Elements.fillBarGrayCoin, 'hidden', true);
    Elements.toggle(Elements.fillBarGoldCoin, 'hidden', false);
    Elements.fillBarBorder?.classList.add('highlight');
    
    this.updateBarText(i18next.t('index.coin-collected-text'), true);
    
    this.playCoinSpin();

    if (Elements.fillTimerEl && this.lastTimer) {
        Elements.fillTimerEl.textContent = this.lastTimer;
    }

    Elements.fillTimerCont?.classList.remove('hidden');
    Elements.resetFillBarButton?.classList.remove('hidden');
    
    if (this.lastTimer === this.bestTimer) {
      Elements.bestTimerText?.classList.add('best');
    }
  },

  handleEmptyState() {
    if (Elements.fillBarFill) {
      Elements.fillBarFill.style.width = '0%';
      delete Elements.fillBarFill.dataset.decaying;
    }

    Elements.toggle(Elements.fillBarGrayCoin, 'hidden', false);
    Elements.toggle(Elements.fillBarGoldCoin, 'hidden', true);
    Elements.fillBarBorder?.classList.remove('highlight');
    
    const guideHtml = `${i18next.t('index.fill-bar-text-guide')} <img class="fill-bar-arrow" src="icons/arrow-fill-right.svg">`;
    this.updateBarText(guideHtml, false);
    
    Elements.fillTimerCont?.classList.add('hidden');
    Elements.resetFillBarButton?.classList.add('hidden');
    Elements.bestTimerText?.classList.remove('best');
  },

  updateBarText(html, show) {
    if (!Elements.fillBarText) return;
    Elements.fillBarText.innerHTML = html;
    Elements.toggle(Elements.fillBarText, 'show', show);
  },

  playCoinSpin() {
    if (this.coinIsSpinning) return;
    this.coinIsSpinning = true;
    Animations.playCoinSpin(
      Elements.fillBarGoldCoin,
      () => { this.coinIsSpinning = false; }
    );
  },

  resetUI() {
    this.handleEmptyState();
  }
};