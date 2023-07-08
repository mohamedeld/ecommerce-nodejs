const express = require("express");
const authController = require("../controller/authController");
const {signInValidator} = require("../middleware/validator/signInValidator");
const 
  {signUpValidator}
  = require("../middleware/validator/signupValidator");
const checkValidator = require("../middleware/checkValidator");

const router = express.Router();

router
  .route("/signup")
  .post(signUpValidator, checkValidator, authController.signUp);

router
  .route("/login")
  .post(signInValidator, checkValidator, authController.login);
  
router
  .route("/forgetpassword")
  .post(authController.forgetPassword);

router.route("/verifyResetCode").post(authController.verifyPasswordResetCode);
router.route("/resetPassword").put(authController.resetPassword);
module.exports = router;
