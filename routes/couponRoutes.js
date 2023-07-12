const express = require("express");
const {createCouponValidator,getCouponValidator,updateCouponValidator,deleteCouponValidator} = require("../middleware/validator/couponValidator");
const couponController = require("../controller/couponController");
const checkValidator = require("../middleware/checkValidator");
const authController = require("../controller/authController");
const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .get(
    authController.allowedTo('user', 'admin'),
    couponController.getAllCoupons
  )
  .post(
    authController.allowedTo('admin'),
    createCouponValidator,
    checkValidator,
    couponController.createCoupon
  );

router
  .route('/:id')
  .get(
     authController.allowedTo('user','admin'),
    getCouponValidator,
    checkValidator,
    couponController.getCoupon
  )
  .patch(
     authController.allowedTo('admin'),
    updateCouponValidator,
    checkValidator,
    couponController.updateCoupon
  )
  .delete(
     authController.allowedTo('admin'),
    deleteCouponValidator,
    checkValidator,
    couponController.deleteCoupon
  );

  module.exports = router;