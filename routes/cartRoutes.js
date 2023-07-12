const express = require("express");
const checkValidator = require("../middleware/checkValidator");
const {createCartValidator,getCartValidator,updateCartValidator,deleteCartValidator} = require("../middleware/validator/cartValidator");
const cartController = require("../controller/cartController");
const authController = require("../controller/authController");
const router = express.Router();


router.use(
  authController.protect,
  authController.allowedTo('user'),
 
);

router
  .route('/')
  .post(createCartValidator, checkValidator, cartController.addProductToCart)
  .get(cartController.getCartForLoggedUser)
  .delete(cartController.clearLoggedUserCart);
  
  router.route('/applyCoupon').put(cartController.applyCoupon);
  router
    .route('/:itemId')
    .put(cartController.updateCartItemQuantity)
    .delete(cartController.removeLoggedUserCart);
module.exports = router;