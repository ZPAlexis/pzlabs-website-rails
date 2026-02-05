let darkMode = JSON.parse(localStorage.getItem('lightMode')) || false;

const body = document.body;
const toggleBtn = document.getElementById('dark-mode-toggle');

applyMode();

/*toggleBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  localStorage.setItem('lightMode', JSON.stringify(darkMode));
  applyMode();
});*/

function applyMode() {
  if (darkMode) {
    body.setAttribute('data-theme', 'light');
  } else {
    body.removeAttribute('data-theme');
  }
}