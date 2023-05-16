const {query,param,body} = require("express-validator");

exports.addProductValidator = [
    body("title").notEmpty().withMessage("should be string"),
    body("description").notEmpty().withMessage("should be string").isLength({max:2000}).withMessage("too long description"),
    body("quantity").notEmpty().withMessage("must be number"),
    body("sold").optional().isNumeric().withMessage("product sold must be number"),
    body("price").notEmpty().withMessage("product price should be number").isLength({max:50}).withMessage("too long price"),
    body("priceAfterDiscount").optional().isNumeric().withMessage("product after discount must be number").toFloat().custom((value,{req})=>{
        if(req.body.price <= value){
            throw new Error("price after discount must be lower than price value")
        }
        return true
    }),
    body("colors").optional().isArray().withMessage("color should be in array of string"),
    body("imageCover").notEmpty().withMessage("image should be string"),
    body("images").optional().isArray().withMessage("color should be in array of string"),
    body("category").optional().isMongoId().withMessage("should be mongodb"),
    body("subcategory").optional().isMongoId().withMessage("should be mongodb"),
    body("brand").optional().isMongoId().withMessage("should be mongodb")
];

exports.getProductValidator = [
    param("id").isMongoId().withMessage("id must be mongodb id")
];
exports.updateProductValidator = [
    param("id").isMongoId().withMessage("id must be mongodb id")
];
exports.deleteProductValidator = [
    param("id").isMongoId().withMessage("id must be mongodb id")
];