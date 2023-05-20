const { query, param, body } = require("express-validator");
const slugify = require("slugify");
const Category = require("../../Model/categoryModel");
const subCategory = require("../../Model/subCategoryModel");

exports.addProductValidator = [
  body("title")
    .optional()
    .isString()
    .withMessage("product name should be string ")
    .notEmpty()
    .withMessage("should be not empty")
    .custom((val, { req }) => {
      if (typeof val !== "string") {
        throw new Error("Product name must be a string");
      }
      req.body.slug = slugify(val);
      return true;
    }),
  body("description")
    .isEmpty()
    .withMessage("description should be string")
    .isLength({ max: 2000 })
    .withMessage("too long description"),
  body("quantity").isEmpty().withMessage("must be number"),
  body("sold")
    .optional()
    .isNumeric()
    .withMessage("product sold must be number"),
  body("price")
    .isEmpty()
    .withMessage(" product price should be number ")
    .isLength({ max: 50 })
    .withMessage("too long price"),
  body("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("product after discount must be number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("price after discount must be lower than price value");
      }
      return true;
    }),
  body("colors")
    .optional()
    .isArray()
    .withMessage("color should be in array of string"),
  body("imageCover").isEmpty().withMessage("image should be string"),
  body("images")
    .optional()
    .isArray()
    .withMessage("color should be in array of string"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("should be mongodb")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`category id ${categoryId} is already in use`)
          );
        }
      })
    ),
  body("subcategory")
    .optional()
    .isMongoId()
    .withMessage("should be mongodb")
    .custom((subcategoryId) =>
      subCategory
        .find({ _id: { $exists: true, $in: subcategoryId } })
        .then((result) => {
          if (result.length < 1 || result.length !== subcategoryId.length) {
            return Promise.reject(new Error("result array is empty"));
          }
        })
    )
    .custom((val, { req }) =>
      subCategory
        .find({ category: req.body.category })
        .then((subcategories) => {
          const subCategoriesInDB = [];
          subcategories.forEach((subcategory) => {
            subCategoriesInDB.push(subcategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));

          if (!checker(val, subCategoriesInDB)) {
            return Promise.reject(new Error(`this sub cateogry is not found`));
          }
        })
    ),
  body("brand").optional().isMongoId().withMessage("should be mongodb"),
];

exports.getProductValidator = [
  param("id").isMongoId().withMessage("id must be mongodb id"),
];
exports.updateProductValidator = [
  param("id").isMongoId().withMessage("id must be mongodb id"),
  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
];
exports.deleteProductValidator = [
  param("id").isMongoId().withMessage("id must be mongodb id"),
];
