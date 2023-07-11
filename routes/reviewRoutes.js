const express= require("express");
const {createReviewValidator,getOneReviewValidator,updateReviewValidator,deleteOneReviewValidator} = require("../middleware/validator/reviewValidator");
const reviewController = require("../controller/reviewController");
const checkValidator = require("../middleware/checkValidator");
const authController =require("../controller/authController");
const router = express.Router({mergeParams:true});

router
  .route('/')
  .get(checkValidator, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.allowedTo('user'),
    reviewController.setReviewToBody,
    createReviewValidator,
    checkValidator,
    reviewController.createReview
  );

  router
    .route("/:id")
    .get(getOneReviewValidator, checkValidator,reviewController.createFilterObj ,reviewController.getOneReview)
    .patch(updateReviewValidator, checkValidator, reviewController.updateReview)
    .delete(
      deleteOneReviewValidator,
      checkValidator,
      reviewController.deleteReview
    );

module.exports = router;