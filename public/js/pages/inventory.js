window.addEventListener('load', () => {
  const dialog = mdc.dialog.MDCDialog.attachTo(
    document.querySelector('#shopping-cart-dialog')
  );
  dialog.listen('MDCDialog:accept', () => {
    window.location = '/checkout';
  });

  const fab = document.querySelector('#shopping-cart-fab');
  fab.addEventListener('click', () => {
    const { cart } = window.ShoppingCart;

    const scrollable = document.querySelector('.mdc-dialog__body--scrollable');
    anime({
      targets: scrollable,
      scrollTop: 0,
    });

    const productList = document.querySelector('#shopping-cart-dialog .mdc-list');
    productList.innerHTML = Object.values(cart).map(product => `
      <li class="mdc-list-item">
        <img
          class="mdc-list-item__start-detail"
          src="${product.IMAGEURL}"
          width="56"
          height="56"
          alt="${product.NAME}"
        >
          <span class="mdc-list-item__text">
            ${product.NAME}
            <span class="mdc-list-item__text__secondary">
              ${product.count} x \$${product.PRICE.toFixed(2)} = \$${
                (product.count * parseFloat(product.PRICE, 10)).toFixed(2)
              }
            </span>
          </span>
      </li>
    `).join('\n');

    const totals = Object.values(cart).reduce((acc, product) => (
      acc + product.count * parseFloat(product.PRICE, 10)
    ), 0);
    const checkoutButton = document.querySelector('.mdc-dialog__footer__button--accept');
    checkoutButton.innerText = `Checkout (\$${totals.toFixed(2)})`;

    dialog.show();
  });
});
