window.addEventListener('load', () => {
  const stepper = document.querySelector('.stepper');
  const buttons = stepper.querySelectorAll('footer > button');
	
	var search, autocomplete;
	var form = {
		street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
	}
	
	// Sample seen by Google Maps API Sample 
	 function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
         autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
            {types: ['geocode']});
        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', addAddress);
      }
	  
	   function fillInAddress() {
        // Get the place details from the autocomplete object.
        var location = autocomplete.getPlace();

        for (var component in componentForm) {
          document.getElementById(component).value = '';
          document.getElementById(component).disabled = false;
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var x = 0; x< place.address_components.length; x++) {
          var address = place.address_components[i].types[0];
          if (componentForm[address]) {
            var newValue = place.address_components[x][componentForm[address]];
            document.getElementById(address).value = newValue;
          }
        }
      }
	  // Will allow the User to input her or his address data via its geoloacation provided by Google API
	  function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }
  
  buttons.forEach(button => {
    mdc.ripple.MDCRipple.attachTo(button);
  });
});
