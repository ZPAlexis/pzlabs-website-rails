export const TutorialManager = {
  STORAGE_KEY: 'app_tutorial_flags',

  init() {
    const flags = this.getFlags();
    Object.keys(flags).forEach(hintId => {
      if (flags[hintId] === true) {
        this.hideElement(hintId);
      }
    });
  },

  getFlags() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  completeHint(hintId) {
    const flags = this.getFlags();
    flags[hintId] = true;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(flags));
    this.hideElement(hintId);
  },

  hideElement(hintId) {
    const el = document.getElementById(hintId);
    if (el) {
      el.style.display = 'none';
    }
  },

  resetFlags() {
    localStorage.removeItem(this.STORAGE_KEY);

    const allHints = document.querySelectorAll('.tutorial-hint');
    allHints.forEach(el => {
      el.style.display = '';
    });
  }
};