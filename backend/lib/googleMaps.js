const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});
const secret = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Gets the distance information between an origin and a destination address
 * @param {string} origin The origin address
 * @param {string} destination The destination address
 * @returns The distance info from Google Distance Matrix API
 */
async function getDistance(origin, destination) {
  return await client.distancematrix({
    params: {
      origins: [origin],
      destinations: [destination],
      key: secret,
    },
  });
}

/**
 * Models a distance response to get relevant information
 * @param {*} distanceData The distance data returned by Google Maps API
 * @returns A modeled distance information for easy access
 */
function modelDistanceResponse(distanceData) {
  const originAddress = distanceData.origin_addresses[0];
  const destinationAddress = distanceData.destination_addresses[0];

  const distanceInformation = distanceData.rows[0].elements[0];
  const distance = distanceInformation.distance.text;
  const duration = distanceInformation.duration.text;

  return {
    origin: originAddress,
    destination: destinationAddress,
    distance,
    duration,
    status: distanceInformation.status,
  };
}

/**
 * Throws if no distance is found
 * @param {*} distanceData The distance data returned by Google Maps API
 */
function throwIfResultNotFound(distanceData) {
  const status = distanceData.rows[0].elements[0].status;
  if (status === "NOT_FOUND")
    throw new Error(
      "The routes you put might be wrong. Please set correct location."
    );
  else if (status === "ZERO_RESULTS") throw new Error("No routes found!");
  else return;
}

module.exports = {
  getDistance,
  modelDistanceResponse,
  throwIfResultNotFound,
};
