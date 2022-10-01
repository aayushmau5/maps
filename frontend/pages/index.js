import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

import { getDistance } from "../utils/api";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const googlemap = useRef(null);
  const originInput = useRef(null);
  const destinationInput = useRef(null);

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError(null);
    const data = await getDistance(origin, destination);

    if (data.error) {
      setError(data.errorMessage);
      setLoading(false);
      return;
    }

    renderPath(data);
    setResponse(data);
    setLoading(false);
  }

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    const mapOptions = {
      center: {
        lat: 28.6448,
        lng: 77.216721,
      },
      zoom: 8,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false,
    };

    loader
      .load()
      .then(() => {
        const google = window.google;

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();

        const map = new google.maps.Map(googlemap.current, mapOptions);
        const originAutocomplete = new google.maps.places.Autocomplete(
          originInput.current,
          {}
        );
        const destinationAutocomplete = new google.maps.places.Autocomplete(
          destinationInput.current,
          {}
        );

        google.maps.event.addListener(
          originAutocomplete,
          "place_changed",
          function () {
            const place = originAutocomplete.getPlace();
            setOrigin(place.formatted_address);
          }
        );

        google.maps.event.addListener(
          destinationAutocomplete,
          "place_changed",
          function () {
            const place = destinationAutocomplete.getPlace();
            setDestination(place.formatted_address);
          }
        );

        originAutocomplete.bindTo("bounds", map);
        destinationAutocomplete.bindTo("bounds", map);

        directionsRenderer.setMap(map);
        window.directionsRenderer = directionsRenderer;
        window.directionsService = directionsService;
      })
      .catch((e) => console.error(e));
  }, []);

  function renderPath(response) {
    window.directionsService
      .route({
        origin: {
          query: response.origin,
        },
        destination: {
          query: response.destination,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        window.directionsRenderer.setDirections(response);
      })
      .catch((e) => console.log(e));
  }

  return (
    <>
      <Head>
        <title>Get the distance</title>
      </Head>
      <div className={styles.parentContainer}>
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Get the distance</h1>

          <form onSubmit={submitForm}>
            <div className={styles.inputContainer}>
              <label className={styles.addressLabel} htmlFor="origin">
                Origin address:
              </label>
              <input
                className={styles.addressInput}
                id="origin"
                onChange={(e) => setOrigin(e.target.value)}
                value={origin}
                ref={originInput}
              />
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.addressLabel} htmlFor="destination">
                Destination address:
              </label>
              <input
                className={styles.addressInput}
                id="destination"
                onChange={(e) => setDestination(e.target.value)}
                value={destination}
                ref={destinationInput}
              />
            </div>

            <input
              className={styles.submitButton}
              type="submit"
              value="Search"
              disabled={loading}
            />
          </form>

          {loading ? <p className={styles.loading}>Loading...</p> : null}
          {response ? <ShowDistanceMatrics distanceInfo={response} /> : null}
          {error ? <p className={styles.errorMessage}>{error}</p> : null}
        </div>

        <div id="map" ref={googlemap}></div>
      </div>
    </>
  );
}

function ShowDistanceMatrics({ distanceInfo }) {
  return (
    <div className={styles.distanceInfoContainer}>
      <p>
        <strong>Distance:</strong> {distanceInfo.distance}
      </p>
      <p>
        <strong>Duration:</strong> {distanceInfo.duration}
      </p>
    </div>
  );
}
