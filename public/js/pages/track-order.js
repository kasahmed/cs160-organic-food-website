function initializeMap() {
  const map = new google.maps.Map(
    document.querySelector('#map'),
    {
      center: {
        lat: 50,
        lng: 50,
      },
      zoom: 5,
    }
  );

}
