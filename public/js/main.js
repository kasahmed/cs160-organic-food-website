window.addEventListener('load', () => {
  window.mdc.autoInit();

  const drawer = new mdc.drawer.MDCTemporaryDrawer(
    document.querySelector('.mdc-temporary-drawer')
  );
  document.querySelector('.menu-button').addEventListener('click', () => {
    drawer.open = true;
  });

  document.querySelectorAll('.mdc-textfield').forEach(
    textField => mdc.textfield.MDCTextfield.attachTo(textField)
  );

  document.querySelectorAll('[data-mdc-ripple-is-unbounded]').forEach(
    ripple => mdc.ripple.MDCRipple.attachTo(ripple)
  )
});
