const {query,param,body} = require("express-validator");

module.exports.createCartValidator = [
  body('productId')
    .isMongoId()
    .withMessage('Product ID must be a valid MongoDB ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('color').isString().withMessage('Color must be a string'),
  body('price').optional().isFloat().withMessage('Price must be a number'),
  body('totalCartPrice')
    .isFloat()
    .optional()
    .withMessage('Total cart price must be a number'),
  body('priceAfterDiscount')
    .isFloat()
    .optional()
    .withMessage('Price after discount must be a number'),
];
module.exports.getCartValidator = [
  param('id')
    .notEmpty()
    .withMessage('please enter your cart id')
    .isMongoId()
    .withMessage('please enter valid id'),
];
module.exports.updateCartValidator = [
  body('productId')
    .optional()
    .isMongoId()
    .withMessage('Product ID must be a valid MongoDB ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('color')
    .optional()
    .isString()
    .withMessage('Color must be a string'),
  body('price')
    .optional()
    .isFloat()
    .withMessage('Price must be a number'),
  body('totalCartPrice')
    .optional()
    .isNumeric()
    .withMessage('Total cart price must be a number'),
  body('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Price after discount must be a number'),
];
module.exports.deleteCartValidator = [
  param('id')
    .notEmpty()
    .withMessage('please enter your cart id')
    .isMongoId()
    .withMessage('please enter valid id'),
];