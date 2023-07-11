const {query,param,body} = require("express-validator");

module.exports.createCouponValidator = [
  body('name').notEmpty().withMessage('please enter coupon name'),
  body('expire')
    .notEmpty()
    .withMessage('please enter coupon expire'),
  body('discount').notEmpty().withMessage('please enter coupon discount').isNumeric().withMessage("coupon discount should be discount")
];
module.exports.getCouponValidator = [
    param("id").notEmpty().withMessage("please enter your id").isMongoId().withMessage("please enter valid id for coupon")
]
module.exports.updateCouponValidator = [
  body('name').optional().notEmpty().withMessage('please enter coupon name'),
  body('expire')
    .optional()
    .notEmpty()
    .withMessage('please enter coupon expire')
    .isDate()
    .withMessage('coupon expire should be date'),
  body('discount')
    .optional()
    .notEmpty()
    .withMessage('please enter coupon discount')
    .isNumeric()
    .withMessage('coupon discount should be discount'),
];

module.exports.deleteCouponValidator = [
  param('id')
    .notEmpty()
    .withMessage('please enter your id')
    .isMongoId()
    .withMessage('please enter valid id for coupon'),
];