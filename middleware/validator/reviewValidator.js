const {query,param,body} = require("express-validator");

module.exports.createReviewValidator = [
  body("title")
    .notEmpty()
    .withMessage("please enter your title")
    .isAlpha()
    .withMessage("title should be string"),
  body("ratings")
    .notEmpty()
    .withMessage("please enter your rating")
    .isNumeric()
    .withMessage("rating should be number"),
  body("user")
    .notEmpty()
    .withMessage("please enter user id")
    .isMongoId()
    .withMessage("user should be mongo id"),
  body("product")
    .notEmpty()
    .withMessage("please enter your title")
    .isMongoId()
    .withMessage("product should be mongo id"),
];

module.exports.getOneReviewValidator = [
  param("id")
    .notEmpty()
    .withMessage("please enter your review id")
    .isMongoId()
    .withMessage("review should be mongo id"),
];

module.exports.updateReviewValidator = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("please enter your title")
    .isAlpha()
    .withMessage("title should be string"),
  body("ratings")
    .optional()
    .notEmpty()
    .withMessage("please enter your rating")
    .isNumeric()
    .withMessage("rating should be number"),
  body("user")
    .optional()
    .notEmpty()
    .withMessage("please enter user id")
    .isMongoId()
    .withMessage("user should be mongo id"),
  body("product")
    .optional()
    .notEmpty()
    .withMessage("please enter your title")
    .isMongoId()
    .withMessage("product should be mongo id"),
];


module.exports.deleteOneReviewValidator = [
  param("id")
    .notEmpty()
    .withMessage("please enter your review id")
    .isMongoId()
    .withMessage("review should be mongo id"),
];