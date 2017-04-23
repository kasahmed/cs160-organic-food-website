window.addEventListener('load', () => {
  const dialogElement = document.querySelector('#shopping-cart-dialog');
  const dialog = mdc.dialog.MDCDialog.attachTo(dialogElement);
  dialog.listen('MDCDialog:accept', () => {
    window.location = '/checkout';
})
const fab = document.querySelector('#shopping-cart-fab');
  fab.addEventListener('click', () => {
    const { cart } = window.ShoppingCart;

    const scrollable = dialogElement.querySelector('.mdc-dialog__body--scrollable');
    anime({
      targets: scrollable,
      scrollTop: 0,
    });

    const productList = dialogElement.querySelector('.mdc-list');
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
            ${product.NAME} (${product.CITY})
            <span class="mdc-list-item__text__secondary">
              ${product.QTY} x \$${product.PRICE.toFixed(2)} = \$${
                (product.QTY * parseFloat(product.PRICE, 10)).toFixed(2)
              }
            </span>
            <a  onclick="ShoppingCart.removeItem('${product.PID}','${product.STOREID}', '${product.QTY}'); return true;" align="left" style="cursor: pointer;">Remove</a>
          </span>
          
      </li>
    `).join('\n');

    const totals = Object.values(cart).reduce((acc, product) => (
      acc + product.QTY * parseFloat(product.PRICE, 10)
      ), 0
)
const checkoutButton = dialogElement.querySelector('.mdc-dialog__footer__button--accept');
    checkoutButton.innerText = `Checkout (\$${totals.toFixed(2)})`;

    dialog.show();
})
})
