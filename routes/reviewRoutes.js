const express= require("express");
const router = express.Router();
const {createReviewValidator,getOneReviewValidator,updateReviewValidator,deleteOneReviewValidator} = require("../middleware/validator/reviewValidator");
const reviewController = require("../controller/reviewController");
const checkValidator = require("../middleware/checkValidator");

router
  .route("/")
  .get(checkValidator, reviewController.getAllReviews)
  .post(createReviewValidator, checkValidator,reviewController.createReview);

  router
    .route("/:id")
    .get(getOneReviewValidator, checkValidator, reviewController.getOneReview)
    .patch(updateReviewValidator, checkValidator, reviewController.updateReview)
    .delete(
      deleteOneReviewValidator,
      checkValidator,
      reviewController.deleteReview
    );

module.exports = router;