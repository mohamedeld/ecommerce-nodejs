const Coupon = require("../Model/couponModel");
const factory = require("./handlerFactory");


exports.createCoupon = factory.createOne(Coupon);
exports.getAllCoupons = factory.findAll(Coupon);

exports.getCoupon = factory.findOne(Coupon);

exports.updateCoupon = factory.updateOne(Coupon);

exports.deleteCoupon = factory.deleteOne(Coupon);
