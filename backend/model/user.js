const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  logged: {
    type: mongoose.Schema.Types.Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema, "users");
