const {query,param,body}  = require("express-validator");
const User = require("../../Model/userModel");
module.exports.signInValidator = [
  body("email")
    .notEmpty()
    .withMessage("please enter your email")
    .isEmail()
    .withMessage("some problem with email"),
  body("password").notEmpty().withMessage("please enter your password").isStrongPassword().withMessage("please enter a strong password"),
];