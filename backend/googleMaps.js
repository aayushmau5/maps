const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});
const secret = process.env.GOOGLE_MAPS_API_KEY;

async function getDistance(origin, destination) {
  return await client.distancematrix({
    params: {
      origins: [origin],
      destinations: [destination],
      key: secret,
    },
  });
}

async function getLatLng(query) {
  return await client.findPlaceFromText({
    params: {
      input: query,
      key: secret,
    },
  });
}

async function getDirections(origin, destination) {
  return await client.directions({
    params: {
      origin,
      destination,
      key: secret,
    },
  });
}

module.exports = {
  getDistance,
  getLatLng,
  getDirections,
};
