const factory = require("./handlerFactory");
const Review = require("../Model/reviewModel");
exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.findAll(Review);
exports.getOneReview = factory.findOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);