const express = require("express");

const router = express.Router();
const checkValidator = require("../middleware/checkValidator");
const {addProductValidator,getProductValidator,updateProductValidator,deleteProductValidator}=require("../middleware/validator/productValidator");
const productController = require("../controller/productController");

router.route("/").get(productController.getAllProducts).post(addProductValidator,checkValidator,productController.createProduct);

router.route("/:id").get(getProductValidator,checkValidator,productController.getProduct).patch(updateProductValidator,checkValidator,productController.updateProduct).delete(deleteProductValidator,checkValidator,productController.deleteProduct);


module.exports = router;

