const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const keys = require("./apikeys");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE, *"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, *"
  );
  next();
});

app.use(bodyParser.json());

mongoose
  .connect(keys.mongoURI)
  .then((result) => {
    console.log("Backend Established");
    app.listen(8080);
  })
  .catch((err) => console.log(err));
