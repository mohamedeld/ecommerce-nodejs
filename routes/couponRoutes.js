const express = require("express");
const {createCouponValidator,getCouponValidator,updateCouponValidator,deleteCouponValidator} = require("../middleware/validator/couponValidator");
const couponController = require("../controller/couponController");
const checkValidator = require("../middleware/checkValidator");
const authController = require("../controller/authController");
const router = express.Router();

router.use(authController.protect, authController.allowedTo('admin'));
router
  .route('/')
  .get(couponController.getAllCoupons)
  .post(
   
    createCouponValidator,
    checkValidator,
    couponController.createCoupon
  );

router
  .route('/:id')
  .get(
    getCouponValidator,
    checkValidator,
    couponController.getCoupon
  )
  .patch(
    updateCouponValidator,
    checkValidator,
    couponController.updateCoupon
  )
  .delete(
    deleteCouponValidator,
    checkValidator,
    couponController.deleteCoupon
  );

  module.exports = router;