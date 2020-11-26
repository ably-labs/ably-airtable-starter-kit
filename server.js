const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const Ably = require("ably");
const envConfig = require("dotenv").config();
const app = express();

const ABLY_API_KEY = process.env.ABLY_API_KEY;

const ablyREST = new Ably.Rest({
  key: ABLY_API_KEY,
});

function generateUniqueId() {
  return "id-" + Math.random().toString(36).substr(2, 16);
}

app.use("/", serveStatic(path.join(__dirname, "ably-airtable-storage/dist")));

app.get("/", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.sendFile(path.join(__dirname, "ably-airtable-storage/dist/index.html"));
});

app.get("/auth", (req, res) => {
  const tokenParams = { clientId: generateUniqueId() };
  ablyREST.auth.createTokenRequest(tokenParams, function (err, tokenRequest) {
    if (err) {
      res.status(500).send("Error requesting token: " + JSON.stringify(err));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(JSON.stringify(tokenRequest));
    }
  });
});

const listener = app.listen(process.env.PORT || 8082, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
