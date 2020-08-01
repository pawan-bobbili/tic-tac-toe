let io;
module.exports = {
  init: (server) => {
    io = require("socket.io")(server);
  },
  getIo: () => {
    if (!io) {
      throw new Error("No socket initialized");
    }
    return io;
  },
};
