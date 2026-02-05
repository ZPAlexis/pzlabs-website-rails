import { trackEvent } from 'logic/utils';
import { NotificationManager } from 'logic/notifications';

const defaultCoinFlags = {
  cover: false,
  fillBar: false,
  rps: false
};

export const GameState = {
  flags: { ...defaultCoinFlags },

  load() {
    const saved = localStorage.getItem('coinFlags');
    if (saved) Object.assign(this.flags, JSON.parse(saved));
    return this.flags;
  },

  save() {
    localStorage.setItem('coinFlags', JSON.stringify(this.flags));
  },

  reset() {
    this.flags = { ...defaultCoinFlags };
    this.save();
    trackEvent("coinsReset");
  },

  getCollectedCount() {
    return Object.values(this.flags).filter(val => val === true).length;
  },

  getTotalCount() {
    return Object.keys(this.flags).length;
  },

  checkCompletion() {
    const total = this.getTotalCount();
    const collected = this.getCollectedCount();

    if (collected === total) {
      trackEvent("allCoinsCollected");
      NotificationManager.notify(1);
      return true;
    }
    return false;
  },

  collectCoverCoin() {
      if (!this.flags.cover) {
          this.flags.cover = true;
          this.save();
          this.checkCompletion();
          trackEvent("boxCoin", { syncToApi: true });
          return true;
      }
      return false;
  },

  collectFillBarCoin() {
      if (!this.flags.fillBar) {
          this.flags.fillBar = true;
          this.save();
          this.checkCompletion();
          trackEvent("fillCoin", { syncToApi: true });
          return true;
      }
      return false;
  },

  collectRPSCoin() {
      if (!this.flags.rps) {
          this.flags.rps = true;
          this.save();
          this.checkCompletion();
          trackEvent("rpsCoin", { syncToApi: true });
          return true;
      }
      return false;
  }
};