const {query, param,body} = require("express-validator");

module.exports.createAddressValidator = [
  body('alias').notEmpty().withMessage('please enter your alias'),
  body('details').notEmpty().withMessage('please enter your details'),
  body('phone').notEmpty().withMessage('please enter your phone'),
  body('city').notEmpty().withMessage('please enter your city'),
  body('postalCode').notEmpty().withMessage('please enter your postalCode'),
];

module.exports.removeAddressValidator = [
    param("addressId").notEmpty().withMessage("please enter your adderss id").isMongoId().withMessage("please enter valid id")
]