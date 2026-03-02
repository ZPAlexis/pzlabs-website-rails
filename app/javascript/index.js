import { GameState } from 'logic/gameState';
import { Elements } from 'logic/uiElements';
import { TabManager } from 'logic/tabManager';
import { TutorialManager } from 'logic/tutorialManager';
import { Animations } from 'logic/animations';
import { RPSGame } from 'logic/rock-paper-scissors';
import { FillBarGame } from 'logic/fillBar';
import { AutoText } from 'logic/autoText';
import { fetchAndDisplayMetrics } from 'logic/api';
import { NotificationManager } from 'logic/notifications';
import i18next from "i18next"
import { changeLanguage } from "i18next"

const App = {
  coinIsSpinning: false,
  
  init() {
    if (typeof i18next !== 'undefined' && i18next.isInitialized) {
      this.startLanguageDependentLogic();
    } else {
      i18next.on('initialized', () => this.startLanguageDependentLogic());
    }
  },

  startLanguageDependentLogic() {
    GameState.load();
    AutoText.init();
    TabManager.init();
    TutorialManager.init();
    RPSGame.init();
    FillBarGame.init();
    
    this.setupEventListeners();
    this.refreshApp();

    fetchAndDisplayMetrics();
  },

  refreshApp() {
    calculateCoinAmount();
    refreshCoverCoin();
    FillBarGame.refreshUI(GameState.flags.fillBar);
    RPSGame.updateRPSFillBar();
    RPSGame.updateScoreText();
  },

  setupEventListeners() {
    Elements.coverButton?.addEventListener('click', () => this.coverCoinClick());

    Elements.summaryCoinContainer?.addEventListener('click', () => {
        this.toggleSummary(false);
    });

    Elements.summaryCloseButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSummary(true);
    });

    Elements.notificationCloseBtn?.addEventListener('click', (e) => {
        NotificationManager.closeNotificationBox();
    });

    Elements.analyticsCoinContainer?.addEventListener('click', () => {
        this.toggleSummary();
        TutorialManager.completeHint('hint-press-button');
    });

    Elements.summaryMenuResetScoreButton?.addEventListener('click', () => {
        this.toggleSummary();
        this.resetCoins();
        TutorialManager.resetFlags();
    });

    Elements.languageBtnEN?.addEventListener('click', () => this.changeAppLanguage('en'));

    Elements.languageBtnPT?.addEventListener('click', () => this.changeAppLanguage('pt'));
  },

  setupScrollObservers() {
    if (Elements.coinSummaryTriggers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;

          Elements.summaryCoinContainer?.classList.remove('hidden');

          const handleTransitionEnd = (e) => {
            if (e.target === el && (e.propertyName === 'transform' || e.propertyName === 'opacity')) {
              el.classList.remove('js-trigger-coin-summary');
              el.removeEventListener('transitionend', handleTransitionEnd);
            }
          };

          el.addEventListener('transitionend', handleTransitionEnd);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    Elements.coinSummaryTriggers.forEach(el => observer.observe(el));
  },

  coverCoinClick() {
    const newlyCollected = GameState.collectCoverCoin();
    
    if (newlyCollected) {
        Elements.coverBoxImg?.classList.add('open');
        this.refreshApp();
        this.playCoverSpin();
        Animations.highlightSummaryCoinContainer();
    } else {
        this.playCoverSpin();
        Animations.restart(Elements.coverCoinScrollText, 'collected');
        Animations.highlightSummaryCoinContainer();
    }
  },

  playCoverSpin() {
    if (this.coinIsSpinning) return;
    this.coinIsSpinning = true;
    Animations.playIdleCoinSpin(
      Elements.coverCoinIdleGif, 
      Elements.coverCoinSpinGif, 
      () => { this.coinIsSpinning = false; }
    );
  },

  toggleSummary(shouldHide) {
    const isHidden = Elements.summaryOverlay.classList.toggle('hidden', shouldHide);
    
    Elements.toggle(document.body, 'no-scroll', !isHidden);
    Elements.toggle(Elements.summaryCoinContainer, 'hidden', !isHidden);
  },

  resetCoins() {
    GameState.reset();
    FillBarGame.resetTimers();
    RPSGame.resetRPSScore();
    this.refreshApp();
  },

  async changeAppLanguage(lang) {
    await changeLanguage(lang);
    this.refreshApp();
    RPSGame.resetResult();
  }
};

export function calculateCoinAmount() {
  const totalCoins = GameState.getTotalCount();
  const coinsCollected = GameState.getCollectedCount();
  const statusText = `${coinsCollected} / ${totalCoins}`;

  Elements.coinAmount.innerHTML = statusText;
  Elements.analyticsCoinAmount.innerHTML = statusText;
  
  Elements.toggle(Elements.summaryCoinContainer, 'hidden', coinsCollected === 0);

  if (coinsCollected !== 0) {
    Animations.fadeUpdate(Elements.coinAmount, statusText);
    TutorialManager.hideElement('hint-press-button');
  }

  updateAnalyticsText(coinsCollected, totalCoins);
  updateSummaryMenu(coinsCollected, totalCoins);
}

export function refreshCoverCoin() {
  const isCoverCollected = GameState.flags.cover;
  
  Elements.toggle(Elements.coverBoxImg, 'idle', !isCoverCollected);
  Elements.toggle(Elements.coverBoxImg, 'hidden', isCoverCollected);
  
  Elements.toggle(Elements.coverCoinContainer, 'idle', isCoverCollected);
  Elements.toggle(Elements.coverCoinContainer, 'hidden', !isCoverCollected);
  
  Elements.toggle(Elements.coverCoinScrollText, 'collected', isCoverCollected);

  if (!isCoverCollected) {
    Elements.coverBoxImg?.classList.remove('open');
  }
}

export function collectFillBarCoin() {
  const isNew = GameState.collectFillBarCoin();
  if (isNew) {
    calculateCoinAmount();
    Animations.highlightSummaryCoinContainer();
  } else {
    Animations.highlightSummaryCoinContainer();
  }
  FillBarGame.refreshUI(GameState.flags.fillBar);
}

export function collectRPSCoin() {
    const isNew = GameState.collectRPSCoin();
    if (isNew) {
      calculateCoinAmount();
      Animations.highlightSummaryCoinContainer();
    }
}

function updateSummaryMenu(coinsCollected, totalCoins) {
  const flagMapping = {
    cover: [
      Elements.summaryMenuCoinCollectedCover,
      Elements.summaryMenuCoverText,
    ],
    fillBar: [
      Elements.summaryMenuCoinCollectedFillbar,
      Elements.summaryMenuFillbarTimerContainer,
      Elements.summaryMenuFillbarText,
    ],
    rps: [
      Elements.summaryMenuCoinCollectedRPS,
      Elements.summaryMenuRPSText,
      Elements.summaryMenuRPSStats,
    ],
  };

  Object.entries(flagMapping).forEach(([flag, elements]) => {
    const isCollected = GameState.flags[flag];
    elements.forEach(el => Elements.toggle(el, 'hidden', !isCollected));
  });

  Elements.setText(Elements.summaryMenuBestTimer, FillBarGame.bestTimer !== null ? `${FillBarGame.bestTimer}s` : '---');

  const allCoinsCollected = coinsCollected === totalCoins;
  
  if (Elements.summaryMenuResetScoreButton) {
    Elements.summaryMenuResetScoreButton.disabled = !allCoinsCollected;
    Elements.toggle(Elements.summaryMenuResetScoreButton, 'locked', !allCoinsCollected);
  }

  Elements.summaryMenuLockIcons.forEach(el => Elements.toggle(el, 'hidden', allCoinsCollected));
  Elements.toggle(Elements.summaryMenuUnlockText, 'hidden', allCoinsCollected);
}

function updateAnalyticsText(collected, total) {
  const allCollected = collected === total;

  const ctaKey = allCollected
  ? 'index.game-analytics-summary-coins-3'
  : 'index.game-analytics-cta';
  
  const summaryKey = `index.game-analytics-summary-coins-${collected}`;

  const percentageKey = allCollected
  ? 'index.game-analytics-summary-percentage-all'
  : 'index.game-analytics-summary-percentage-none';

  Elements.analyticsCTACoins.innerHTML = i18next.t(ctaKey);
  Elements.analyticsSummaryCoins.innerHTML = i18next.t(summaryKey);
  Elements.analyticsSummaryPercentage.innerHTML = i18next.t(percentageKey);
}

App.init();