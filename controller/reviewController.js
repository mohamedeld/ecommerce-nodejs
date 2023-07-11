const factory = require("./handlerFactory");
const Review = require("../Model/reviewModel");

exports.createFilterObj = (request,response,next)=>{
    let filterObject = {};
    if(request.params.productId) filterObject = { product: request.params.productId };
    request.filterObj = filterObject;
    next();
}
exports.setReviewToBody = (request,response,next)=>{
    if(!request.body.product) request.body.product = request.params.productId;
    if(!request.body.user) request.body.user = request.user._id;
    next();
}
exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.findAll(Review);
exports.getOneReview = factory.findOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);