window.addEventListener('load', () => {
  window.mdc.autoInit();

  const MDCTemporaryDrawer = mdc.drawer.MDCTemporaryDrawer;
  const drawer = new MDCTemporaryDrawer(
    document.querySelector('.mdc-temporary-drawer')
  );
  document.querySelector('.menu-button').addEventListener('click', () => {
    drawer.open = true;
  });
});
