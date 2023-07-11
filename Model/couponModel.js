const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'coupon name is required'],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, 'coupon expire date is required'],
    },
    discount: {
      type: Number,
      required: [true, 'coupon discount is required'],
    }
  },
  { timestamp: true }
);


module.exports = mongoose.model('Coupon', couponSchema);