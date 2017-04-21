window.addEventListener('load', () => {
  const stepper = document.querySelector('.stepper');
  const buttons = stepper.querySelectorAll('footer > button');

  buttons.forEach(button => {
    mdc.ripple.MDCRipple.attachTo(button);
  });
});
