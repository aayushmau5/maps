import Script from "next/script";
import "../styles/globals.css";
import { initMap } from "../utils/maps";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {/* <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDmjtTVsyS6AA_QIRiK0vZR1R33vpWHi80&callback=initMap&v=weekly"
        defer
      /> */}
    </>
  );
}

export default MyApp;
