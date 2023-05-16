const {query,param,body} = require("express-validator");

exports.addSubCategoryValidator = [
    body("name").isAlpha().withMessage("should be string"),
    body("category").isMongoId().withMessage("should be mongodb id")
];

exports.getSubCategoryValidator = [
    param("id").isMongoId().withMessage("should be mongodb id")
];

exports.updateSubCategoryValidator = [
    body("name").optional().isAlpha().withMessage("should be string"),
    body("category").optional().isMongoId().withMessage("should be mongodb id")
];

exports.deleteSubCategoryValidator = [
    param("id").isMongoId().withMessage("should be mongodb id")
];