import { Elements } from 'logic/uiElements';
import i18next from "i18next"

export const AutoText = {
  coverBlinkActive: true,
  controller: { stopped: false },
  listControllers: new WeakMap(),
  coverTextOptions: [],
  targets: [],
  i1: 0,

  init() {
    if (i18next.isInitialized) {
      this.runAutoText();
    } else {
      i18next.on('initialized', () => this.runAutoText());
    }
  },

  runAutoText() {
    this.targets = Elements.listTextsHTML;

    this.coverTextOptions = i18next.t('index.intro-cover-options', { returnObjects: true });

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const chooseCoverText = () => {
      const text = this.coverTextOptions[this.i1];
      this.i1 = (this.i1 + 1) % this.coverTextOptions.length;
      return text;
    };

    const startCoverBarBlink = async () => {
      while (true) {
        if (this.coverBlinkActive) {
          Elements.coverBarBlinkHTML.innerHTML = '|';
          await sleep(800);
          Elements.coverBarBlinkHTML.innerHTML = '&nbsp;';
          await sleep(400);
        } else {
          Elements.coverBarBlinkHTML.innerHTML = '|';
          await sleep(400);
        }
      }
    };

    const startListBarBlink = async () => {
      while (true) {
        Elements.listBarBlinkHTML.forEach(el => el.innerHTML = '|');
        await sleep(800);
        Elements.listBarBlinkHTML.forEach(el => el.innerHTML = '&nbsp;');
        await sleep(400);
      }
    };

    const typeText = async (textString, html, ms) => {
      const controller = { stopped: false };
      this.listControllers.set(html, controller);
      for (let i = 0; i < textString.length; i++) {
        const currentController = this.listControllers.get(html);
        if (currentController !== controller || controller.stopped) break;
        html.innerHTML += textString[i];
        await sleep(ms);
      }
    };

    const eraseCoverText = async () => {
      while (Elements.coverTextHTML.innerHTML.length > 0) {
        Elements.coverTextHTML.innerHTML = Elements.coverTextHTML.innerHTML.slice(0, -1);
        await sleep(60);
      }
    };

    const startCoverText = async () => {
      while (true) {
        let currentCoverText = chooseCoverText();
        await sleep(200);

        this.coverBlinkActive = false;
        await typeText(currentCoverText, Elements.coverTextHTML, 80);
        this.coverBlinkActive = true;

        await sleep(2000);

        this.coverBlinkActive = false;
        await eraseCoverText();
        this.coverBlinkActive = true;
      }
    };

    const startListText = (element) => {
      const key = element.dataset.text;
      const text = i18next.t(key);
      typeText(text, element, 60);
    };

    const restartListTexts = () => {
      this.targets.forEach((element) => {
        const controller = this.listControllers.get(element);
        if (controller) controller.stopped = true;

        element.innerHTML = '';
        const key = element.dataset.text;
        const text = i18next.t(key);
        typeText(text, element, 60);
      });
    };

    const autoTextObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startListText(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.8 });

    this.targets.forEach(target => autoTextObserver.observe(target));

    i18next.on('languageChanged', () => {
      this.coverTextOptions = i18next.t('index.intro-cover-options', { returnObjects: true });
      this.controller.stopped = true; // This will stop current cover loop
      Elements.coverTextHTML.innerHTML = '';
      this.i1 = 0;
      restartListTexts();
    });

    startCoverBarBlink();
    startCoverText();
    startListBarBlink();
  }
};