const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();
const checkValidator = require("../middleware/checkValidator");
const {
  addProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../middleware/validator/productValidator");
const productController = require("../controller/productController");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    addProductValidator,
    checkValidator,
    productController.uploadProductImages,
    productController.resizeProductImage,
    productController.createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, checkValidator, productController.getProduct)
  .patch(
    authController.protect,
    productController.uploadProductImages,
    productController.resizeProductImage,
    updateProductValidator,
    checkValidator,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    deleteProductValidator,
    checkValidator,
    productController.deleteProduct
  );

module.exports = router;
