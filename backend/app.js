const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const keys = require("./apikeys");
const socket = require("./socket");

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

app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  if (!err.message) {
    err.message = ["Internal Server Error"];
  }
  if (typeof err.message === String) {
    err.message = [err.message];
  }
  res.status(err.stausCode || 500).json(err);
});

const users = {};

mongoose
  .connect(keys.mongoURI)
  .then((result) => {
    console.log("Backend Established");
    const server = app.listen(8080);
    socket.init(server);
    const io = socket.getIo();
    io.on("connection", (socket) => {
      console.log("Client Connected", socket.id);
      console.log(socket.request._query);
      users[socket.request._query.email] = socket.id;
      socket.on("send-request", (data) => {
        console.log(data);
        socket
          .to(users[data.to])
          .emit("recieve-request", { from: "admin1@node.com" });
      });
    });
  })
  .catch((err) => console.log(err));
