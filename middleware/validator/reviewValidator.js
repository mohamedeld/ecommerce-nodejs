const {query,param,body} = require("express-validator");
const Review = require("../../Model/reviewModel");
module.exports.createReviewValidator = [
  body('title').optional().notEmpty().withMessage('please enter your title'),
  body('ratings')
    .notEmpty()
    .withMessage('please enter your rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('rating should be number'),
  body('user')
    .notEmpty()
    .withMessage('please enter user id')
    .isMongoId()
    .withMessage('user should be mongo id'),
  body('product')
    .notEmpty()
    .withMessage('please enter your title')
    .isMongoId()
    .withMessage('product should be mongo id')
    .custom((val, { req }) => {
      return Review.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error('you already created a review before')
          );
        }
      });
    }),
];

module.exports.getOneReviewValidator = [
  param("id")
    .notEmpty()
    .withMessage("please enter your review id")
    .isMongoId()
    .withMessage("review should be mongo id"),
];

module.exports.updateReviewValidator = [
  body("id")
    .isMongoId()
    .withMessage("review should be mongo id").custom((val,{req})=>{
        return Review.findById(val).then((review)=>{
            if(!review){
                return Promise.reject(new Error("there are no review"))
            }
            if (review.user._id.toString() !== req.user._id.toString()) {
              return Promise.reject(
                new Error("you are not allowed to perform this action")
              );
            }
        })
    }),
];


module.exports.deleteOneReviewValidator = [
  param("id")
    .isMongoId()
    .withMessage("review should be mongo id").custom((val,{req})=>{
        return Review.findById(val).then((review)=>{
            if (!review) {
              return Promise.reject(new Error("there are no review"));
            }
            if(req.user.role === "user"){
                if (review.user._id.toString() !== req.user._id.toString()) {
                  return Promise.reject(
                    new Error("you are not allowed to perform this action")
                  );
                }
            }
            
        })
        return true;
    }),
];