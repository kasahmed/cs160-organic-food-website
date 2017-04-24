window.addEventListener('load', () => {
  const dialogElement = document.querySelector('#shopping-cart-dialog');
  const dialog = mdc.dialog.MDCDialog.attachTo(dialogElement);
  dialog.listen('MDCDialog:accept', () => {
    window.location = '/checkout';
  });

  const fab = document.querySelector('#shopping-cart-fab');
  fab.addEventListener('click', () => {
    const scrollable = dialogElement.querySelector('.mdc-dialog__body--scrollable');
    scrollable.scrollTop = 0;

    const productList = dialogElement.querySelector('.mdc-list');
    productList.innerHTML = _.flatMap(
      window.ShoppingCart.cart,
      store => _.map(store, ({ count, item }) => `
        <li class="mdc-list-item">
          <img
            class="mdc-list-item__start-detail"
            src="${item.IMAGEURL}"
            width="56"
            height="56"
            alt="${item.NAME}"
          >
          <span class="mdc-list-item__text">
            ${item.NAME} (${item.CITY})
            <span class="mdc-list-item__text__secondary">
              ${count} x \$${item.PRICE.toFixed(2)} = \$${(count * parseFloat(item.PRICE, 10)).toFixed(2)}
            </span>
          </span>
          <span class="mdc-list-item__end-detail">
            <button class="mdc-button">
              <i class="material-icons">remove_shopping_cart</i>
            </button>
          </span>
        </li>`
      )
    ).join('\n');

    productList.querySelectorAll('.mdc-button').forEach(
      button => mdc.ripple.MDCRipple.attachTo(button)
    );

    const checkoutButton = dialogElement.querySelector('.mdc-dialog__footer__button--accept');
    checkoutButton.innerText = `Checkout (\$${window.ShoppingCart.total.toFixed(2)})`;

    dialog.show();
  });
  fab.click();

  const snackbar = document.querySelector('#item-added-snackbar');
  const snackbarTimeout = 2500;
  window.onAddItemClicked = item => {
    ShoppingCart.add(item);
    snackbar.MaterialSnackbar.showSnackbar({
      message: `You added ${item.NAME} for \$${item.PRICE.toFixed(2)} from ${item.CITY}`,
      timeout: snackbarTimeout,
    });

    // shift fab up when snackbar is active.
    // the fab is only shifted up on mobile screens.
    fab.classList.add('snackbar-active');
    setTimeout(() => {
      fab.classList.remove('snackbar-active');
    }, snackbarTimeout);
  };
});
