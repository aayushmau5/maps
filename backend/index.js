const express = require("express");
require("dotenv").config();
const { getDistance } = require("./googleMaps");

const app = express();

function modelDistanceResponse(distanceData) {
  const output = {};

  const originAddress = distanceData.origin_addresses[0];
  const destinationAddress = distanceData.destination_addresses[0];
  output.origin = originAddress;
  output.destination = destinationAddress;

  const distanceInformation = distanceData.rows[0].elements[0];

  if (distanceInformation.status === "NOT_FOUND") {
    output.distance = null;
    output.duration = null;
    output.status = "NOT_FOUND";
  } else if (distanceInformation.status === "ZERO_RESULTS") {
    output.distance = null;
    output.duration = null;
    output.status = "ZERO_RESULTS";
  } else {
    output.distance = distanceInformation.distance.text;
    output.duration = distanceInformation.duration.text;
    output.status = "OK";
  }

  return output;
}

// cases:
// {"destination_addresses":["Boston, MA, USA"],"origin_addresses":[""],"rows":[{"elements":[{"status":"NOT_FOUND"}]}],"status":"OK"}
// {"destination_addresses":["Boston, MA, USA"],"origin_addresses":["Surajpur, Chhattisgarh 497229, India"],"rows":[{"elements":[{"status":"ZERO_RESULTS"}]}],"status":"OK"}
// {"data":{"destination_addresses":["California, USA"],"origin_addresses":["Boston, MA, USA"],"rows":[{"elements":[{"distance":{"text":"5,000 km","value":4999947},"duration":{"text":"1 day 23 hours","value":169858},"status":"OK"}]}],"status":"OK"}}

// TODO: handle error
// TODO: write test
// TODO: handle edge cases
// TODO: add logging
// TODO: handle cases when API request timesout(or the API limit is exhausted)
// TODO: send appropriate response code and errors
app.get("/", async (req, res) => {
  const origin = req.query.origin;
  const destination = req.query.destination;

  const distanceResponse = await getDistance(origin, destination).catch((err) =>
    console.log(err)
  );
  const distanceData = distanceResponse.data;
  const modeledData = modelDistanceResponse(distanceData);
  res.json({ data: modeledData });
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
