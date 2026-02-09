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