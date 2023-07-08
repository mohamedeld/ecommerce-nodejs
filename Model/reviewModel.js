const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
        type: Number,
        min: [1, "min ratings value is 1.0"],
        max: [5, "min ratings value is 5.0"],
        required:[true,"ratings are required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "review must belong to product"],
    },
  },
  { timstamp: true }
);

module.exports = mongoose.model("Review", reviewSchema);