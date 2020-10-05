const express = require("express");
require("dotenv").config();
const geoip = require("geoip-lite");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 });

const app = express();
const { PORT } = process.env;
app.enable("trust proxy");

app.get("/", (req, res) => {
  // const clientIP = req.headers['x-original-forwarded-for'] || req.ip;
  const clientIP = "81.174.136.42";
  if (!clientIP) {
    const err = `No ip found for client ip: ${clientip}`;
    console.error(err);
    return res.status(404).send(err);
  }

  const cachedCountry = cache.get(clientIP);
  if (cachedCountry) return res.status(200).send(cachedCountry);

  const geo = geoip.lookup(clientIP);
  if (!geo.country) {
    const err = `No country found for client ip: ${clientip}`;
    console.error(err);
    return res.status(404).send(err);
  }

  const addedToCache = cache.set(clientIP, geo.country);
  if (!addedToCache) console.error(`Failed to cache client IP: ${clientIP}`);

  return res.status(200).send(geo.country);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
