const express = require("express");
const checkValidator = require("../middleware/checkValidator");
const authController = require("../controller/authController");
const {
  addProductToWishListValidator,
  removeProductFromWishListValidator,
} = require('../middleware/validator/wishListValidator');
const wishListController = require("../controller/wishListController");
const router = express.Router();

router.use(
  authController.protect,
  authController.allowedTo('user'),
  checkValidator
);
router
  .route('/')
  .post(
    addProductToWishListValidator,
    wishListController.addProductToWishList
  )
  .get(wishListController.getLoggedUserWishList);

router
  .route('/:productId')
  .delete(
    removeProductFromWishListValidator,
    wishListController.removeProductFromWishList
  );
module.exports = router;