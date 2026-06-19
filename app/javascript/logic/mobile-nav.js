export function mobileNavSelect(button) {
  const currentActiveElements = document.querySelectorAll('.js-nav-toggle:not(.inactive)');

  currentActiveElements.forEach((el) => {
    el.classList.add('inactive');
  });

  const elementsToActivate = button.querySelectorAll('.inactive');

  elementsToActivate.forEach((el) => {
    el.classList.remove('inactive');
  });
}

export function positionNavIndicator(button) {
  const indicator = document.querySelector('.js-mobile-nav-indicator');
  if (!indicator || !button) return;

  indicator.style.transform = `translateX(${button.offsetLeft}px)`;
  indicator.style.width = `${button.offsetWidth}px`;
}