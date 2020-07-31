const { body } = require("express-validator");
const express = require("express");

const authController = require("../controllers/auth");
const User = require("../model/user");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .bail()
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then((userDoc) => {
            if (userDoc) {
              return Promise.reject(
                "A user with this email address already exists"
              );
            }
            return true;
          })
          .catch((err) => Promise.reject(err.message));
      }),
  ],
  authController.signupHandler
);

router.post("/login", [
  body("email").isEmail().withMessage("Not a valid Email").bail(),
]);
