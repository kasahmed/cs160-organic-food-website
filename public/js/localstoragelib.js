/**
 * Created by Kashan on 4/13/2017.
 */

function storeData(key, item)
{
    if(typeof (Storage) !== "undefined")
        return localStorage.setItem(key, item);
    else
        console.log('Browser does not support web storage');
    return null;
}

function getData(key)
{
    return localStorage.getItem(key);
}

function removeData(key) {
    return localStorage.removeItem(key);
}