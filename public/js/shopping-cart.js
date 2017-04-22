//noinspection JSAnnotator
const fileKey = 'cart';
window.ShoppingCart = {
  add(item /*, count*/) {

    const  {cart}  = this;

    for(var i = 0; i < cart.length; i++)
      if (cart[i].PID == item.PID && cart[i].STOREID == item.STOREID) {
        cart[i].QTY += 1;
        this.cart = cart;
        return;
      }

    item.QTY = 1;
    cart.push(item);
    this.cart = cart;
  },

  get cart() {
    return (JSON.parse(localStorage.getItem(fileKey)) || [] );
  },

  set cart(cart) {
    const cartData = JSON.stringify(cart);
    localStorage.setItem(fileKey, cartData);
  },

  removeAll() {
    localStorage.removeItem(fileKey);
  },

  removeItem(item, count)
  {
    const  {cart}  = this;

    for(var i = 0; i < cart.length; i++)
    {
      if (cart[i].PID == item.PID && cart[i].STOREID == item.STOREID) {
        cart[i].QTY -= count;
        if(cart[i].QTY <= 0)
            cart.splice(i, 1);

        this.cart = cart;
        return true;
      }
    }

    return false;
  }
};