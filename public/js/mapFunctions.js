/**
 * Created by Kashan on 4/8/2017.
 * modified by Salman Anza
 */


var map;
var directionDisplay;
var directionsService;
var stepDisplay;
var markerArray = [];
var position;
var marker = null;
var polyline = null;
var poly2 = null;
var speed = 0.000005, wait = 1;
var infowindow = null;
var service = new google.maps.DistanceMatrixService;
var myPano;
var panoClient;
var nextPanoId;
var timerHandle = null;
var ONUM;

function createMarker(isTruckBool, latlng, label, html) {
    //alert("createMarker(" + latlng + "," + label + "," + html + ","+ ","+isTruckBool+")");
    var contentString = '<b>' + label + '</b><br>' + html;
    var marker = null;
    if (isTruckBool)
    {
        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: label,
            icon: '/images/delivery-truck.png',
            zIndex: Math.round(latlng.lat() * -100000) << 5
        });
    }
    else {
        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: label,
            zIndex: Math.round(latlng.lat() * -100000) << 5
        });
    }

    marker.myname = label;
    // gmarkers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map,marker);
    });
    return marker;
}


function initialize() {

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
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

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
    }, callback);
}

function callback(response, status) {
    if (status == 'OK') {
        var distance = response.rows[0].elements[0].distance.text;
        var duration = response.rows[0].elements[0].duration.text;
        console.log("The distance is " + distance + " and the duration is " + duration + "");

    }
}

var steps = []

function trackOrder(apiHost)
{
    var trackNum = document.getElementById("input_track_number").value;

    xhr = new XMLHttpRequest();
    var url = apiHost + "/group_one/shop/track/" + trackNum;

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                var jsonArray = JSON.parse(xhr.responseText);
                var address = jsonArray[0].SNUM + " " + jsonArray[0].SNAME + " " + jsonArray[0].CITY + " " + jsonArray[0].STATE;
                var current = jsonArray[0].TLAT + " " + jsonArray[0].TLONG;
                ONUM = jsonArray[0].ONUM;
                console.log(xhr.responseText);
                console.log('got Data');

                calcRoute(address, current);
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
    /*
    polyline = new google.maps.Polyline({
        path: [],
        strokeColor: '#FF0000',
        strokeWeight: 3
    });
    poly2 = new google.maps.Polyline({
        path: [],
        strokeColor: '#FF0000',
        strokeWeight: 3
    });*/
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
        map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    var start = current//"San Jose, CA";//document.getElementById("start").value;
    var end = address//"Samta Clara, CA";//document.getElementById("end").value;
    var travelMode = google.maps.DirectionsTravelMode.DRIVING

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

            // For each route, display summary information.
            var path = response.routes[0].overview_path;
            var legs = response.routes[0].legs;
            for (i=0;i<legs.length;i++) {
                if (i == 0) {
                    startLocation.latlng = legs[i].start_location;
                    startLocation.address = legs[i].start_address;
                    // marker = google.maps.Marker({map:map,position: startLocation.latlng});
                    marker = createMarker(1,legs[i].start_location,"start",legs[i].start_address,"green");
                }
                endLocation.latlng = legs[i].end_location;
                endLocation.address = legs[i].end_address;
                var steps = legs[i].steps;
                for (j=0;j<steps.length;j++) {
                    var nextSegment = steps[j].path;
                    for (k=0;k<nextSegment.length;k++) {
                        //polyline.getPath().push(nextSegment[k]);
                        bounds.extend(nextSegment[k]);



                    }
                }
            }

            //polyline.setMap(map);
            //map.fitBounds(bounds);
        //createMarker(endLocation.latlng,"end",endLocation.address,"red");
            map.setZoom(18);
            //startAnimation();
            setTimeout(trackOrder, 5000);
        }
    });
}





var step = 1; // 5; // metres
var tick = 1; // milliseconds
var eol;
var k=0;
var stepnum=0;
var speed = "";
var lastVertex = 1;


//=============== animation functions ======================
function updatePoly(d) {
    // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
    if (poly2.getPath().getLength() > 20) {
        poly2=new google.maps.Polyline([polyline.getPath().getAt(lastVertex-1)]);
        // map.addOverlay(poly2)
    }

    if (polyline.GetIndexAtDistance(d) < lastVertex+2) {
        if (poly2.getPath().getLength()>1) {
            poly2.getPath().removeAt(poly2.getPath().getLength()-1)
        }
        poly2.getPath().insertAt(poly2.getPath().getLength(),polyline.GetPointAtDistance(d));
    } else {
        poly2.getPath().insertAt(poly2.getPath().getLength(),endLocation.latlng);
    }
}


function animate(d) {

    if (d>eol) {
        alert("You have arrived at destination");
        map.panTo(endLocation.latlng);
        marker.setPosition(endLocation.latlng);
        getDist(service, map, marker.position, endLocation.address);

        return;
    }
    var p = polyline.GetPointAtDistance(d);
    map.panTo(p);
    marker.setPosition(p);
    getDist(service, map, marker.position, endLocation.address);
    updatePoly(d);
    timerHandle = setTimeout("animate("+(d+step)+")", tick);
}


function startAnimation() {
    eol=polyline.Distance();
    map.setCenter(polyline.getPath().getAt(0));

    poly2 = new google.maps.Polyline({path: [polyline.getPath().getAt(0)], strokeColor:"#0000FF", strokeWeight:10});

    setTimeout("animate(50)",2000);  // Allow time for the initial map display
}


//=============== ~animation funcitons =====================
