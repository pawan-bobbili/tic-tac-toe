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
        username: req.body.username,
      });
      return user.save();
    })
    .then((result) =>
      res.status(201).json({ message: "User created Succesfully" })
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
  bcryptjs
    .compare(req.body.password, req.userDoc.password)
    .then((matched) => {
      if (!matched) {
        const error = new Error();
        error.statusCode = 403;
        error.message = ["Invalid email/password"];
        throw error;
      }
      const token = jwt.sign(
        { email: req.body.email, name: req.userDoc.username },
        keys.jwtSecret,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({ token: token, name: req.userDoc.username });
    })
    .catch((err) => next(err));
};
