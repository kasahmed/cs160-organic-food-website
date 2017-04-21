window.ShoppingCart = {
  add(item) {
    const { cart } = this;

    if (!(item.PID in cart)) {
      cart[item.PID] = Object.assign({}, item, {
        count: 0,
      });
    }

    if (item.QTY <= 0 || cart[item.PID].count >= item.QTY) {
      console.error('Unable to add to cart, item out of stock!');
      return;
    }

    cart[item.PID].count++;
    this.cart = cart;
  },

  get cart() {
    return JSON.parse(localStorage.getItem('cart') || '{}');
  },

  set cart(cart) {
    const cartData = JSON.stringify(cart);
    localStorage.setItem('cart', cartData);
  },
};
