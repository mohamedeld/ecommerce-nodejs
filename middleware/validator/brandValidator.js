const {query,param,body} =require("express-validator");
const slugify = require("slugify");

exports.addBrandValidator = [
    body("name").isAlpha().withMessage("category name should be string").custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true
    }),
    body("image").isAlpha().withMessage("should be string")
];

exports.getBrandValidator = [
    param("id").isMongoId().withMessage("should be mongodb id")
];
exports.updateBrandValidator = [
    body("name").optional().isAlpha().withMessage("should be string").custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    body("image").optional().isAlpha().withMessage("should be string")
];
exports.deleteBrandValidator = [
    param("id").isMongoId().withMessage("should be mongodb id")
]