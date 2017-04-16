/**
 * Created by Kashan on 4/13/2017.
 */

var key = 'shoppingcart';
function addItemToCart(item)
{
    //removeData(key);
    var cartItems = getCartItems();

    var jsonArray = [];
    if(cartItems != null)
        jsonArray = cartItems;

    for(var i = 0; i < jsonArray.length; i++)
    {
        if(jsonArray[i].PID === item.PID && jsonArray[i].STOREID === item.STOREID) //adding to a previous item in cart
        {
            jsonArray[i].QTY = Number(jsonArray[i].QTY) + Number(item.QTY);
            storeData(key, JSON.stringify(jsonArray));
            console.log("shopping cart old: " +  jsonArray[0] + " items: " + item);
            return true;

        }
    }

    //new item not in shopping cart
    jsonArray.push(item);
    storeData(key, JSON.stringify(jsonArray));
    console.log("shopping cart new:  " +  jsonArray[0].PID + " item: " + item);
    return true;
}

function getCartItems() {
    var items = [];
    items = getData(key);
    var jsonArray = JSON.parse(items);
    return jsonArray;
}


function displayCartOnWeb()
{
    var items = getCartItems();
    var strValue = "";
    var totalAmount = 0;

    for(var i = 0; i < items.length; i++)
    {
        totalAmount += total = Number(items[i].PRICE) * Number(items[i].QTY);
        strValue += items[i].NAME + "   $" +  items[i].PRICE + "     " + items[i].QTY + "    " + items[i].CITY + "   $" + total;
        strValue += '<p></p>';
    }
    strValue += "<h2>Total: $" + totalAmount + "</h2>";

    document.getElementById('itemsInCart').innerHTML = strValue;
    console.log('I hope this works');
}

function removeAllCartItems()
{
    return removeData(key);
}