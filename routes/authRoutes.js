const express = require("express");
const authController = require("../controller/authController");
const {
  signUpValidator,
  signInValidator,
} = require("../middleware/validator/signupValidator");
const checkValidator = require("../middleware/checkValidator");

const router = express.Router();

router
  .route("/signup")
  .post(signUpValidator, checkValidator, authController.signUp);

router
  .route("/login")
  .post(signInValidator, checkValidator, authController.login);

module.exports = router;
