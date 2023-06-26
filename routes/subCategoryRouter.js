const express = require("express");

const router = express.Router({mergeParams:true});

const {addSubCategoryValidator,getSubCategoryValidator,updateSubCategoryValidator,deleteSubCategoryValidator} = require('../middleware/validator/subCategoryValidator');

const checkValidator = require("../middleware/checkValidator");
const authController = require("../controller/authController");
const subCategoryController = require("../controller/subCategoryController");


router
  .route("/")
  .get(
    subCategoryController.createFilterObject,
    subCategoryController.allSubCategories
  )
  .post(
    authController.protect,
    subCategoryController.setCategoryToBody,
    addSubCategoryValidator,
    checkValidator,
    subCategoryController.createSubCategory
  );

router
  .route("/:id")
  .get(
    getSubCategoryValidator,
    checkValidator,
    subCategoryController.getSubCategory
  )
  .patch(
    authController.protect,
    updateSubCategoryValidator,
    checkValidator,
    subCategoryController.updateSubCategory
  )
  .delete(
    authController.protect,
    deleteSubCategoryValidator,
    checkValidator,
    subCategoryController.deleteSubCategory
  );

module.exports = router;
