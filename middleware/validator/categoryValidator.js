const {query,param,body} = require("express-validator");


exports.addCategoryValidator = [
    body("name").isAlpha().withMessage("category name should be string")
]
exports.getCategoryValidator = [
    param("id").isMongoId().withMessage("id must be mongodb id")
];

exports.updateCategoryValidator =[
    body("name").optional().isAlpha().withMessage("category name should be integer")
];
exports.deleteCategoryValidator = [
    param("id").isMongoId().withMessage("id must be mongodb id")
];