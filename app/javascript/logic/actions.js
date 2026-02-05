import { trackEvent } from 'logic/utils';

export const buttonActions = {
  fillBar: async (el) => {
    const { FillBarGame } = await import('logic/fillBar');
    const value = parseInt(el.dataset.value, 10);
    FillBarGame.increment(value);
  },

  rps: async (el) => {
    const { RPSGame } = await import('logic/rock-paper-scissors');
    const move = el.dataset.value;
    RPSGame.playGame(move);
  },

  navigate: (el) => {
    const target = el.dataset.target;
    const newTab = el.dataset.newTab === 'true' || el.dataset.blank === 'true';
    const trackingEventName = el.dataset.tracking;

    if (trackingEventName) {
      trackEvent(trackingEventName);
    }

    if (newTab) {
      window.open(target, '_blank');
    } else {
      window.location.href = target;
    }
  }
};