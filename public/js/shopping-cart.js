//noinspection JSAnnotator
const fileKey = 'cart';
window.ShoppingCart = {
  add(item , count) {

    const  {cart}  = this;

    for(var i = 0; i < cart.length; i++)
      if (cart[i].PID == item.PID && cart[i].STOREID == item.STOREID) {
        const newQty = cart[i].QTY + count;
        if(item.QTY < newQty)
          return false;
        cart[i].QTY += count;
        return this.cart = cart;
      }

    if(item.QTY < count)
      return false;

    item.QTY = count;
    cart.push(item);
    return this.cart = cart;
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

  removeItem(itemPid, itemStoreId, count)
  {
    const  {cart}  = this;

    for(var i = 0; i < cart.length; i++)
    {
      if (cart[i].PID == itemPid && cart[i].STOREID == itemStoreId) {
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