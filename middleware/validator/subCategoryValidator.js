const {query,param,body} = require("express-validator");
const slugify = require("slugify");

exports.addSubCategoryValidator = [
    body("name").isAlpha().withMessage("category name should be string").custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true
    }),
    body("category").isMongoId().withMessage("should be mongodb id")
];

exports.getSubCategoryValidator = [
    param("id").isMongoId().withMessage("should be mongodb id")
];

exports.updateSubCategoryValidator = [
    body("name").optional().isAlpha().withMessage("should be string").custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    body("category").optional().isMongoId().withMessage("should be mongodb id")
];

exports.deleteSubCategoryValidator = [
    param("id").isMongoId().withMessage("should be mongodb id")
];