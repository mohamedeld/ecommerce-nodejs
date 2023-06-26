const express = require("express");
const {
  addBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../middleware/validator/brandValidator");
const checkValidator = require("../middleware/checkValidator");
const brandController = require("../controller/brandController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, brandController.getAllBrands)
  .post(
    authController.protect,
    brandController.uploadBrandImage,
    brandController.resizeImage,
    addBrandValidator,
    checkValidator,
    brandController.createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, checkValidator, brandController.getBrand)
  .patch(
    authController.protect,
    brandController.uploadBrandImage,
    brandController.resizeImage,
    updateBrandValidator,
    checkValidator,
    brandController.updateBrand
  )
  .delete(
    authController.protect,
    deleteBrandValidator,
    checkValidator,
    brandController.deleteBrand
  );

module.exports = router;
