var map;
var directionDisplay;
var directionsService;
var stepDisplay;
var markerArray = [];
var position;
var marker = null;
var poly1 = null;
var poly2 = null;
var speed = 0.000005, wait = 1;
var infowindow = null;
var myPano;
var panoClient;
var nextPanoId;
var timerHandle = null;
var ONUM;
var steps = [];


//Initializes a the track order Map
function initializeMap() {

    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();

    infowindow = new google.maps.InfoWindow(
        {
            size: new google.maps.Size(150, 50)
        });

    const map = new google.maps.Map(
        document.querySelector('#map'),
        {
            center: {
                lat: 0,
                lng: 0,
            },
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

    address = 'Santa Clara'
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
        map.setCenter(results[0].geometry.location);
    });

    //Instantiates a renderer for directions and binds it to the map
    var renderOptions = {
        map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);

    //Instantiate an info window to hold text
    stepDisplay = new google.maps.InfoWindow();

    //Instantiate two polyLines to create path
    poly1 = new google.maps.Polyline({
        path: [],
        strokeColer: '#FF0000',
        strokeWeight: 3
    });
    poly2 = new google.maps.Polyline({
        path: [],
        strokeColor: '#FF0000',
        strokeWeight: 3
    });
}

//creates the truck marker
function createTruckMark(latlng, label, html) {
    var contentString = '<b"' + label + '</b><br>' + html;
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: label,
        zIndex: Math.round(latlng.lat() * -100000) << 5
    });
    marker.myname = label;

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
    return marker;
}


//calculates the route the truck needs to take based on the destination address and current position

function calcRoute(address, current) {
    console.log("Calling calc route. address is  " + address + " and the current is " + current + "");
    if (timerHandle) {
        clearTimeout(timerHandle);
    }
    if (marker) {
        marker.setMap(null);
    }
    poly1.setMap(null);
    poly2.setMap(null);
    directionDisplay.setMap(null);

    //creates a renderer and binds it to map
    //Instantiates a renderer for directions and binds it to the map
    var renderOptions = {
        map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);
    var start = current;
    var end = address;
    var travelMode = google.maps.DirectionsTravelMode.DRIVING;

    var request = {
        origin: start,
        destination: end,
        travelMode: travelMode
    };

    //Route directions and pass response
    directionsService.route(request, function (response, status){
        if(status == google.maps.DirectionsStatus.Ok){
            directionsDisplay.setDirections(response);

            var bounds = new google.maps.LatLngBounds();
            var route = response.routes[0];
            startLocation = new Object();
            endLocation = new Object();

            //For each route, display summary info in a clickable window
            var path = response.routes[0].overview_path;
            var legs = response.routes[0].legs;
            for (i = 0; i < legs.length;i++){
                if (i == 0) {
                    startLocation.latlng = legs[i].start_location;
                    startLocation.address = legs[i].start_address;
                    marker = createTruckMark( legs[i].start_location, "start",legs[i].start_address, "green");
                }
                endLocation.latlng = legs[i].end_location;
                endLocation.address = legs[i].end_address;
                var steps = legs[i].steps;
                for (j = 0; j < steps.length; j++) {
                    var nextSegment = steps[j].path;
                    for (k = 0; k < nextSegment.length; k++) {
                        bounds.extend(nextSegment[k]);
                    }
                }
            }
            map.setZoom(18);
            //call pubnub listener here
            setTimeout(trackOrder, 5000);
        }

    });
}

//Retrieve the current position of the package
function trackOrder(apiHost) {
    console.log("Calling trackOrder");
    //const trackNum = document.getElementById("input_track_number").value;
    //const trackNum = 15936584;
    //const url = `${apiHost}/group_one/shop/track/${trackNum}`;

   
    xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                var jsonArray = JSON.parse(xhr.responseText);
                var address = jsonArray[0].SUM + " " + jsonArray[0].SNAME + " " + jsonArray[0].CITY + " " + jsonArray[0].STATE;
                var current = jsonArray[0].TLAT + " " + jsonArray[0].TLONG;
                ONUM = jsonArray[0].ONUM;
                console.log(xhr.responseText);
                console.log('got Data');
                calcRoute(address, current);
            }
            catch (err) {
                window.alert(truckNum + ' was not found');
                console.log(err);
            }
        }
    };
    xhr.send();
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
            console.log("The distance is " + distance + " and the duration is " + duration + "");

        }
    });
}
