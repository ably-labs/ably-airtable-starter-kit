const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");

const app = express();


app.use("/", serveStatic(path.join(__dirname, "ably-airtable-storage/dist")));


app.get("/", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(__dirname, "ably-airtable-storage/dist/index.html"));
});

const listener = app.listen(process.env.PORT || 8082, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
