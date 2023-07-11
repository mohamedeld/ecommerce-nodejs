const express = require("express");
const checkValidator = require("../middleware/checkValidator");
const {createCartValidator,getCartValidator,updateCartValidator,deleteCartValidator} = require("../middleware/validator/cartValidator");
const cartController = require("../controller/cartController");
const authController = require("../controller/authController");
const router = express.Router();


router.use(authController.protect);

router.route("/").post(authController.allowedTo('user'),createCartValidator,checkValidator,cartController.addProductToCart);

module.exports = router;