const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const randomstring = require("randomstring");

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
const ids = {};

mongoose
  .connect(keys.mongoURI)
  .then((result) => {
    console.log("Backend Established");
    const server = app.listen(8080);
    socket.init(server);
    const io = socket.getIo();
    io.on("connection", (socket) => {
      console.log("Client Connected", socket.id);
      //console.log(socket.request._query);
      users[socket.request._query.email] = { id: socket.id, room: null };
      ids[socket.id] = socket.request._query.email;

      socket.on("send-request", (data) => {
        let roomno = randomstring.generate(10);
        users[ids[socket.id]].room = roomno;
        socket.join(roomno);
        console.log(data);
        socket
          .to(users[data.to].id)
          .emit("recieve-request", { from: "admin1@node.com" });
      });

      socket.on("request-declined", (data) => {
        io.sockets.connected[users[data.of].id].leave(users[data.of].room);
        users[data.of].room = null;
        socket.to(users[data.of].id).emit("request-declined", {});
      });

      socket.on("request-accepted", (data) => {
        socket.join(users[data.of].room);
        users[ids[socket.id]].room = users[data.of].room;
        socket.to(users[data.of].id).emit("request-accepted", {});
        setTimeout(
          () =>
            io.in(users[data.of].room).emit("server-message", {
              message: `Ready for the game ${users[data.of].room}`,
            }),
          5000
        );
      });
    });
  })
  .catch((err) => console.log(err));
