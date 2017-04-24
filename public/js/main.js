window.addEventListener('load', () => {
  window.mdc.autoInit();

  const drawer = new mdc.drawer.MDCTemporaryDrawer(
    document.querySelector('.mdc-temporary-drawer')
  );
  document.querySelector('.menu-button').addEventListener('click', () => {
    drawer.open = true;
  });

  document.querySelector('.drawer').querySelectorAll('.mdc-list-item').forEach(
    listItem => mdc.ripple.MDCRipple.attachTo(listItem)
  );

  document.querySelectorAll('.mdc-button').forEach(
    button => mdc.ripple.MDCRipple.attachTo(button)
  );

  document.querySelectorAll('.mdc-textfield').forEach(
    textField => mdc.textfield.MDCTextfield.attachTo(textField)
  );
});
