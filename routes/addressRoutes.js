const express = require("express");
const checkValidator = require("../middleware/checkValidator");
const authController = require("../controller/authController");
const {
  createAddressValidator,
  removeAddressValidator,
} = require('../middleware/validator/addressValidator');
const addressController = require("../controller/addressController");
const router = express.Router();

router.use(
  authController.protect,
  authController.allowedTo('user'),
  checkValidator
);
router
  .route('/')
  .post(createAddressValidator, addressController.addAddressToUser)
  .get(addressController.getAddressForloggedUser);

router
  .route('/:addressId')
  .delete(removeAddressValidator, addressController.removeAddressFromUser);
module.exports = router;