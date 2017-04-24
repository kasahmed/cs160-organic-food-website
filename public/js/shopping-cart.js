window.ShoppingCart = {
  localStorageKey: 'cart',

  get cart() {
    return JSON.parse(
      localStorage.getItem(this.localStorageKey) || '{}'
    );
  },

  set cart(cart) {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(cart)
    );
  },

  get total() {
    return _.reduce(
      this.cart,
      (result, store) => result + _.reduce(
        store,
        (result, { count, item }) => result + count * item.PRICE,
        0
      ),
      0
    );
  },

  add(item) {
    const { cart } = this;
    if (!cart[item.STOREID]) {
      cart[item.STOREID] = {};
    };
    if (!cart[item.STOREID][item.PID]) {
      cart[item.STOREID][item.PID] = {
        item,
        count: 0,
      };
    }
    cart[item.STOREID][item.PID].count++;
    this.cart = cart;
  },

  clear() {
    localStorage.removeItem(this.localStorageKey);
  },

  remove({ productId, storeId }) {
  },
};
