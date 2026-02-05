export function mobileNavSelect(button) {
  const activeButton = document.querySelectorAll('.js-nav-active');

  activeButton.forEach((el) => {
    el.classList.add('inactive');
  });

  const selectedButton = button.querySelectorAll('.js-nav');

  selectedButton.forEach((el) => {
    el.classList.remove('inactive');
  });
}