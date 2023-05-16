const {query,param,body} =require("express-validator");

exports.addBrandValidator = [
    body("name").isAlpha().withMessage("should be string"),
    body("image").isAlpha().withMessage("should be string")
];

exports.getBrandValidator = [
    param("id").isMongoId().withMessage("should be mongodb id")
];
exports.updateBrandValidator = [
    body("name").optional().isAlpha().withMessage("should be string"),
    body("image").optional().isAlpha().withMessage("should be string")
];
exports.deleteBrandValidator = [
    param("id").isMongoId().withMessage("should be mongodb id")
]