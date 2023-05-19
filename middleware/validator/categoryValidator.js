const {query,param,body} = require("express-validator");

const slugify = require("slugify");

exports.addCategoryValidator = [
    body("name").isAlpha().withMessage("category name should be string").custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true
    })
]
exports.getCategoryValidator = [
    param("id").isMongoId().withMessage("id must be mongodb id")
];

exports.updateCategoryValidator =[
    body("name").optional().isAlpha().withMessage("category name should be string").custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true
    })
];
exports.deleteCategoryValidator = [
    param("id").isMongoId().withMessage("id must be mongodb id")
];