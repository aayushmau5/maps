export function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 41.85, lng: -87.65 },
  });

  directionsRenderer.setMap(map);

  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
    .route({
      origin: {
        query: "california",
      },
      destination: {
        query: "boston",
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => console.log(e));
}

if (typeof window !== "undefined") window.initMap = initMap;
