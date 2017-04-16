/**
 * Created by Kashan on 4/3/2017.
 */
var myCookies = {};
function alertMessage()
{
    alert("Hello! I am an alert box!!");
}
function saveCookies()
{
    myCookies["_user"] = document.getElementById("user").value;
    myCookies["_uage"] = document.getElementById("age").value.toString();
    //Start Reuseable Section
    document.cookie = "";
    var expiresAttrib = new Date(Date.now()+60*1000).toString();
    var cookieString = "";
    for (var key in myCookies)
    {
        cookieString = key+"="+myCookies[key]+";"+expiresAttrib+";";
        document.cookie = cookieString;
    }
    //End Reuseable Section
    document.getElementById("out").innerHTML = document.cookie;
}
function loadCookies()
{
    //Start Reuseable Section
    myCookies = {};
    var kv = document.cookie.split(";");
    for (var id in kv)
    {
        var cookie = kv[id].split("=");
        myCookies[cookie[0].trim()] = cookie[1];
    }
    //End Reuseable Section
    document.getElementById("user").value = myCookies["_user"];
    document.getElementById("age").value = myCookies["_uage"];
}