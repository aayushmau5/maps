import { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

import { getDistance } from "../utils/api";
import styles from "../styles/Home.module.css";
import Head from "next/head";

export default function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const googlemap = useRef(null);

  async function submitForm(e) {
    setLoading(true);
    setResponse(null);
    e.preventDefault();
    const data = await getDistance(origin, destination);
    setLoading(false);
    setResponse(data);
  }

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyDmjtTVsyS6AA_QIRiK0vZR1R33vpWHi80",
      version: "weekly",
    });

    const mapOptions = {
      center: {
        lat: 0,
        lng: 0,
      },
      zoom: 8,
      fullscreenControl: false, // remove the top-right button
      mapTypeControl: false, // remove the top-left buttons
      streetViewControl: false, // remove the pegman
      zoomControl: false, // remove the bottom-right buttons
    };

    loader
      .load()
      .then(() => {
        const google = window.google;

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();

        console.log(google);
        const map = new google.maps.Map(googlemap.current, mapOptions);

        directionsRenderer.setMap(map);

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
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <>
      <Head>
        <title>Find the direction</title>
      </Head>

      <div className={styles.parentContainer}>
        <h1 className={styles.heading}>Find the destination</h1>

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
        {response ? <ShowDistanceMatrics distanceInfo={response.data} /> : null}
      </div>

      <div id="map" ref={googlemap}></div>
    </>
  );
}

function ShowDistanceMatrics({ distanceInfo }) {
  return (
    <div className={styles.distanceInfoContainer}>
      <p>
        <strong>Origin:</strong> {distanceInfo.origin}
      </p>
      <p>
        <strong>Destination:</strong> {distanceInfo.destination}
      </p>
      <p>
        <strong>Distance:</strong> {distanceInfo.distance}
      </p>
      <p>
        <strong>Duration:</strong> {distanceInfo.duration}
      </p>
    </div>
  );
}
