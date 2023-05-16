const express = require("express");

const router = express.Router({mergeParams:true});

const {addSubCategoryValidator,getSubCategoryValidator,updateSubCategoryValidator,deleteSubCategoryValidator} = require('../middleware/validator/subCategoryValidator');

const checkValidator = require("../middleware/checkValidator");

const subCategoryController = require("../controller/subCategoryController");


router.route("/").get(subCategoryController.createFilterObject,subCategoryController.allSubCategories).post(subCategoryController.setCategoryToBody,addSubCategoryValidator,checkValidator,subCategoryController.createSubCategory);

router.route("/:id").get(getSubCategoryValidator,checkValidator,subCategoryController.getSubCategory).patch(updateSubCategoryValidator,checkValidator,subCategoryController.updateSubCategory).delete(deleteSubCategoryValidator,checkValidator,subCategoryController.deleteSubCategory);

module.exports = router;
