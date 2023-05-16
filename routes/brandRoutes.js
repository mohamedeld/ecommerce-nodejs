const express = require("express");
const {addBrandValidator,getBrandValidator,updateBrandValidator,deleteBrandValidator} =  require("../middleware/validator/brandValidator");
const checkValidator = require("../middleware/checkValidator");
const brandController = require("../controller/brandController");

const router = express.Router();


router.route("/").get(brandController.getAllBrands).post(addBrandValidator,checkValidator,brandController.createBrand);

router.route("/:id").get(getBrandValidator,checkValidator,brandController.getBrand).patch(updateBrandValidator,checkValidator,brandController.updateBrand).delete(deleteBrandValidator,checkValidator,brandController.deleteBrand);


module.exports = router;