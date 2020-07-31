const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const keys = require("../apikeys");
const User = require("../model/user");

exports.signupHandler = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors = errors.array();
    const error = new Error();
    error.message = [];
    for (let err of errors) {
      error.message.push(err.param + " validation failed: " + err.msg);
    }
    error.statusCode = 422;
    throw error;
  }
  return bcryptjs
    .hash(req.body.password, keys.bcryptjsSecret)
    .then((hashPwd) => {
      const user = new User({
        email: req.body.email,
        password: hashPwd,
        logged: false,
      });
      return user.save();
    })
    .then((result) =>
      res.staus(201).json({ message: "User created Succesfully" })
    )
    .catch((err) => next(err));
};

exports.loginHandler = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors = errors.array();
    const error = new Error();
    error.message = [];
    for (let err of errors) {
      error.message.push(err.param + " validation failed: " + err.msg);
    }
    error.statusCode = 422;
    throw error;
  }
};
