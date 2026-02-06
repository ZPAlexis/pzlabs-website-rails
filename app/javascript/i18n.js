import i18next from "i18next"
import i18nextHttpBackend from "i18next-http-backend"
import i18nextBrowserLanguageDetector from "i18next-browser-languagedetector"

i18next
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    debug: false,
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt'],
    load: 'languageOnly',
    backend: {
      loadPath: '/locales/{{lng}}/translation.json'
    }, interpolation: {
    escapeValue: false
    }
  }, function(err, t) {
    if (err) return console.error(err);
    updateContent();
  });
  


function updateContent() {
  console.log("Starting to update content with i18n")
  // Text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18next.t(key);
  });
  
  // HTML
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = i18next.t(key);
  });

  // Images (src)
  document.querySelectorAll('[data-i18n-img]').forEach(el => {
    const key = el.getAttribute('data-i18n-img');
    el.src = i18next.t(key);
  });

  // Links (href)
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.getAttribute('data-i18n-href');
    el.href = i18next.t(key);
  });

  // Links / any attribute
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const attrs = JSON.parse(el.getAttribute('data-i18n-attr'));
    for (const [attrName, key] of Object.entries(attrs)) {
      el.setAttribute(attrName, i18next.t(key));
    }
  });
}

export function changeLanguage(lng) {
  return new Promise(resolve => {
    i18next.changeLanguage(lng, () => {
      updateContent();
      resolve();
    });
  });
}

const languageBtnPT = document.querySelector('.js-pt-locale');
const languageBtnEN = document.querySelector('.js-en-locale');
  
if (languageBtnEN) {
  languageBtnEN.addEventListener('click', () => changeLanguage('en'));
}
if (languageBtnPT) {
  languageBtnPT.addEventListener('click', () => changeLanguage('pt'));
}