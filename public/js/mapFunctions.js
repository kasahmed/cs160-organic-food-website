/**
 * Created by Kashan on 4/8/2017.
 * modified by Salman Anza
 */


var map;
var directionsService;
var stepDisplay;
var marker = null;
var polyline = null;
var poly2 = null;
var infowindow = null;
const distanceService = new google.maps.DistanceMatrixService;
var timerHandle = null;
var ONUM;
var TNUM;
var hostUrl;
const pnChannel = "map-channel";
var pubnub = null;
var endLoc;

//listener fucntion for the pubnub channel. Updates the truck marker position based on new coordinates
function moveTruck(payload) {
    const lat = payload.message.lat;
    const lng = payload.message.lng;
    console.log("The lat and lng from payload is: " + lat + ", " + lng);
    map.setCenter({ lat: lat, lng: lng, alt: 0 });
    marker.setPosition({ lat: lat, lng: lng, alt: 0 });
};

function createMarker(latlng, label, end) {
    console.log("createMarker(" + latlng + "," + label+ ")");
    marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: label,
            icon: '/images/delivery-truck.png',
            zIndex: Math.round(latlng.lat() * -100000) << 5
        });
    marker.myname = label;

    google.maps.event.addListener(marker, 'click', function() {
        getDist(distanceService, map, latlng, end);
        infowindow.open(map,marker);
    });
    return marker;
}


function initialize(apiHost,pubKey,subKey) {

    hostUrl = apiHost;
    //Sets up pubNub subscriber channel
    pubnub = new PubNub({
        publishKey: '' + pubKey,
        subscribeKey: '' + subKey
    });
    pubnub.subscribe({ channels: [pnChannel] });
    pubnub.addListener({ message: moveTruck });



    infowindow = new google.maps.InfoWindow(
        {
            size: new google.maps.Size(150,50)
        });

    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();

    // Create a map and center it on Manhattan.
    var myOptions = {
        zoom: 13,
        center: new google.maps.LatLng( 0, 0 ),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map"), myOptions);

    address = 'Santa Clara';
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
        map.setCenter(results[0].geometry.location);
    });

    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
        map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    // Instantiate an info window to hold step text.
    stepDisplay = new google.maps.InfoWindow();

    polyline = new google.maps.Polyline({
        path: [],
        strokeColor: '#FF0000',
        strokeWeight: 3
    });
    poly2 = new google.maps.Polyline({
        path: [],
        strokeColor: '#FF0000',
        strokeWeight: 3
    });
}


//Calculates the remaining time and distance until destianiton of the current location of the truck
function getDist(service, map, origin, destination) {
    service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        if (status == 'OK') {
            var distance = response.rows[0].elements[0].distance.text;
            var duration = response.rows[0].elements[0].duration.text;
            var ret = "The remaining distance is " + distance + "<br> The remaining time is " + duration + ".";
            console.log(ret);
            infowindow.setContent(ret);
        }
    });
}

var steps = [];

function trackOrder(updateBool, trackNum)
{
  if(!hostUrl)
    return;

  TNUM = trackNum;
  console.log("TNUM is: " + TNUM + " and UpdateBool is " + updateBool );
    xhr = new XMLHttpRequest();
    const url = hostUrl + "/group_one/shop/track/" + trackNum;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                if (updateBool == 0)
                {
                    var jsonArray = JSON.parse(xhr.responseText);
                    var address = jsonArray[0].SNUM + " " + jsonArray[0].SNAME + " " + jsonArray[0].CITY + " " + jsonArray[0].STATE;
                    var current = jsonArray[0].TLAT + " " + jsonArray[0].TLONG;
                    ONUM = jsonArray[0].ONUM;
                    console.log(xhr.responseText);
                    console.log('got Data');
                    calcRoute(address, current);
                }
                else {
                    var jsonArray = JSON.parse(xhr.responseText);
                    ONUM = jsonArray[0].ONUM;
                    console.log(xhr.responseText);
                    console.log('got Data');
                    var current = new google.maps.LatLng(jsonArray[0].TLAT, jsonArray
                    [0].TLONG);
                    console.log("In trackOrder, current is: " + current);
                    updateTruck(current);
                }

            }
            catch (err)
            {
                window.alert(trackNum + ' was not found');
                console.log(err);
            }
        }
    };
    xhr.send();
}



function calcRoute(address, current){
    if (timerHandle) { clearTimeout(timerHandle); }
    if (marker) { marker.setMap(null);}
    polyline.setMap(null);
    poly2.setMap(null);
    directionsDisplay.setMap(null);

    var rendererOptions = {
        map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    var start = current;
    var end = address;
    var travelMode = google.maps.DirectionsTravelMode.DRIVING;

    var request = {
        origin: start,
        destination: end,
        travelMode: travelMode
    };

    // Route the directions and pass the response to a
    // function to create markers for each step.
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK){
            directionsDisplay.setDirections(response);

            var bounds = new google.maps.LatLngBounds();
            var route = response.routes[0];
            startLocation = new Object();
            endLocation = new Object();
            endLoc = endLocation; //so getDist() always has an ending location
            // For each route, display summary information.
            var path = response.routes[0].overview_path;
            var legs = response.routes[0].legs;
            for (i=0;i<legs.length;i++) {
                if (i == 0) {
                    startLocation.latlng = legs[i].start_location;
                    startLocation.address = legs[i].start_address;
                    // marker = google.maps.Marker({map:map,position: startLocation.latlng});
                    marker = createMarker(legs[i].start_location, "Your Order Is On The Way!",  legs[i].end_location);
                }
                endLocation.latlng = legs[i].end_location;
                endLocation.address = legs[i].end_address;
                var steps = legs[i].steps;
                for (j=0;j<steps.length;j++) {
                    var nextSegment = steps[j].path;
                    for (k=0;k<nextSegment.length;k++) {
                        bounds.extend(nextSegment[k]);
                    }
                }
            }
            map.setZoom(18);
            updateTruck(null);
        }
    });
}

//updates truck every five seconds
function updateTruck(current){
    getDist(distanceService, map, marker.position, address, endLoc);
    if (current == null) {
        setTimeout(trackOrder(1, TNUM), 5000);
    }
    else {
        console.log("current in updateTruck is: " + current);
        pubnub.publish({ channel: pnChannel, message: {lat:current.lat(), lng: current.lng()}});
        setTimeout(function () { trackOrder(1, TNUM) }, 5000);
    }


}
