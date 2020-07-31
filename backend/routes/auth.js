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
          .catch((err) => Promise.reject(err));
      }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be atleast 6 characters long"),
  ],
  authController.signupHandler
);

router.post(
  "/signin",
  [
    body("email")
      .isEmail()
      .withMessage("Not a valid Email")
      .bail()
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then((userDoc) => {
            if (!userDoc) {
              return Promise.reject("No Account found with this email address");
            }
            req.userDoc = userDoc;
            return true;
          })
          .catch((err) => Promise.reject(err)); // No message property here
      }),
  ],
  authController.loginHandler
);

module.exports = router;
