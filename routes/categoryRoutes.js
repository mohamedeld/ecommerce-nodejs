const express = require("express");

const router = express.Router();
const categoryController = require("../controller/categoryController");
const {
  addCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../middleware/validator/categoryValidator");
const checkValidator = require("../middleware/checkValidator");
const subCategoriesRouter = require("./subCategoryRouter");

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    addCategoryValidator,
    checkValidator,
    categoryController.createCategory
  );
router.use("/:categoryId/subcategories", subCategoriesRouter);
router
  .route("/:id")
  .get(getCategoryValidator, checkValidator, categoryController.getCategory)
  .patch(
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    updateCategoryValidator,
    checkValidator,
    categoryController.updateCategory
  )
  .delete(
    deleteCategoryValidator,
    checkValidator,
    categoryController.deleteCategory
  );
module.exports = router;
