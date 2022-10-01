// TODO: write test
// TODO: handle edge cases
// TODO: add logging
// TODO: handle cases when API request timesout(or the API limit is exhausted)

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  getDistance,
  modelDistanceResponse,
  throwIfResultNotFound,
} = require("./lib/googleMaps");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.get("/", async (req, res) => {
  const origin = req.query.origin;
  const destination = req.query.destination;

  try {
    const distanceResponse = await getDistance(origin, destination);
    const distanceData = distanceResponse.data;
    throwIfResultNotFound(distanceData);
    const modeledData = modelDistanceResponse(distanceData);
    res.status(200).json({ data: modeledData });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
