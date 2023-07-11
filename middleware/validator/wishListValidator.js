const {query,param,body} = require("express-validator");

module.exports.addProductToWishListValidator = [
    body("productId").notEmpty().withMessage("please enter your productId").isMongoId().withMessage("please enter valid id for product")
];

module.exports.removeProductFromWishListValidator = [
  param('productId')
    .notEmpty()
    .withMessage('please enter your productId')
    .isMongoId()
    .withMessage('please enter valid id for product'),
];
