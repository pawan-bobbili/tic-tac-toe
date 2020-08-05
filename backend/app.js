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
const nameOf = {};
const games = {};
const winning = [448, 56, 7, 292, 146, 73, 273, 84];

mongoose
  .connect(keys.mongoURI)
  .then((result) => {
    console.log("Backend Established");
    const server = app.listen(8080);
    socket.init(server);
    const io = socket.getIo();
    io.on("connection", (socket) => {
      console.log("Client Connected", socket.id);
      users[socket.request._query.name] = { id: socket.id, room: null };
      nameOf[socket.id] = socket.request._query.name;

      socket.on("send-request", (data) => {
        let roomno = randomstring.generate(10);
        if (!users[data.to]) {
          return socket.emit("server-message", {
            message: "Player is offline now!!",
          });
        }
        if (users[data.to].room) {
          return socket.emit("server-message", {
            message: "Player is on another game.",
          });
        }
        if (users[data.to].id === socket.id) {
          return socket.emit("server-message", {
            message: "It is a dual-player game buddyy!!",
          });
        }
        users[nameOf[socket.id]].room = roomno;
        socket.join(roomno);
        console.log(data);
        socket
          .to(users[data.to].id)
          .emit("recieve-request", { from: nameOf[socket.id] });
      });

      socket.on("request-declined", (data) => {
        io.sockets.connected[users[data.of].id].leave(users[data.of].room);
        users[data.of].room = null;
        socket.to(users[data.of].id).emit("request-declined", {});
      });

      socket.on("request-accepted", (data) => {
        const roomno = users[data.of].room;
        socket.join(roomno);
        users[nameOf[socket.id]].room = roomno;
        socket.to(users[data.of].id).emit("request-accepted", {});
        games[roomno] = {
          [users[data.of].id]: { status: 0, ele: "X" },
          [socket.id]: { status: 0, ele: "O" },
          players: [users[data.of].id, socket.id],
          next: 0,
        };
      });
      socket.on("make-move", (data) => {
        const roomno = users[nameOf[socket.id]].room;
        const room = games[roomno];
        // Extra Request
        if (room.players[room.next] !== socket.id) {
          io.to(socket.id).emit("server-message", {
            message: "Wait till your turn..",
          });
          return;
        }
        const player = room[room.players[room.next]];
        if ((player.status & (1 << data.pos)) === 1 << data.pos) {
          io.to(socket.id).emit("server-message", {
            message: "Already occupied",
          });
          return;
        }
        player.status = player.status | (1 << data.pos);
        io.in(roomno).emit("apply-move", { pos: data.pos, ele: player.ele });
        let gamedone = false;
        for (let number of winning) {
          if ((number & player.status) === number) {
            io.to(socket.id).emit("game-over", {
              message: "Won the game !!",
            });
            io.to(room.players[room.next ^ 1]).emit("game-over", {
              message: "Lost the game",
            });
            gamedone = true;
            break;
          }
        }
        if (!gamedone) {
          if (
            (player.status | room[room.players[room.next ^ 1]].status) ===
            511
          ) {
            io.in(roomno).emit("game-over", { message: "Game Draw !!" });
          }
        }
        if (gamedone) {
          for (let socketId of room.players) {
            io.sockets.connected[socketId].leave(roomno);
            users[nameOf[socketId]].room = null;
          }
          delete games[roomno];
        }
        room.next = room.next ^ 1;
      });
    });
    io.on("disconnect", (socket) => {
      console.log("Client disconnected ", socket.id);
    });
  })
  .catch((err) => console.log(err));
