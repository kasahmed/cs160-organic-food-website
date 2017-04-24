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
    return true;
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
  },

  displayCartOnWeb()
  {
    const  {cart}  = this;
    let strValue = "<tr> <th scrope='col'>ITEM</th> <th> </th> <th >PRICE</th> <th >QTY</th> <th >STORE</th><th >SUBTOTAL</th> </tr>";
    let totalAmount = 0;


    for(let i = 0; i < cart.length; i++)
    {
      let subTotal = cart[i].QTY * cart[i].PRICE;
      totalAmount += subTotal;
      strValue += "<tr>";
      strValue += "<th><img src= '" + cart[i].IMAGEURL +"' ></th>";
      strValue += "<th>" + cart[i].NAME +"</th>";
      strValue += "<th>" + cart[i].PRICE.toFixed(2) +"</th>";
      strValue += "<th>" + cart[i].QTY +"</th>";
      strValue += "<th>" + cart[i].CITY +"</th>";
      strValue += "<th>" + subTotal.toFixed(2) +"</th>";
      strValue += "<th><input type='submit' onclick='ShoppingCart.removeItem(" + cart[i].PID +", "+ cart[i].STOREID + "  , " + cart[i].QTY + "); location.reload();' value='Remove'></th>";
      strValue += "</tr>";
    }

    strValue += "<tr>Total: " + totalAmount.toFixed(2) + " </tr>";
    document.getElementById('shoppingTable').innerHTML = strValue;
    document.getElementById('billingDiv').style = 'dispaly: none';
  },

  checkout(form, apiHost, remove)
  {

    const  {cart}  = this;

    if(cart.length <= 0)
    {
      alert('No items in cart to order');
      return false;
    }


    const streetAddress = form.streetAddress.value;
    const city = form.city.value;
    const state = form.state.value;
    const email = form.emailInput.value;
    const phone = '+1'+form.phone.value;


    //alert('Over here man');
    //return true;

    const url = apiHost + "/group_one/shop/order";
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        try {

          if(JSON.parse(xhr.responseText)  != "success") {
            console.log(JSON.parse(xhr.responseText));
            alert('Something went wrong processing your order, please check to see if the QTY of the item is in stock ' +
              'at the desired location.');

            return false;
          }

          alert('Order Successfully processed. You will receive a email or text message with order and tracking number. Thank you for shopping.');
          remove();
          return true;
          window.location = "/";

        }
        catch (err)
        {
          alert('Error processing order');
          console.log(err);

        }
      }

    };


    const data = JSON.stringify({"order": JSON.stringify(cart), "streetAddress" : streetAddress, "city" : city, "state" : state, "email" : email, "phoneNumber" : phone});
    console.log(data);
    xhr.send(data);
    return true;
  }


};
