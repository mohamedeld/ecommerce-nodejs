const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "please enter your email"],
    },
    passwordChangeAt: Date,
    password: {
      type: String,
      required: [true, "please enter your password"],
      minLength: [6, "password should be greater than 6"],
    },
    passwordResetCode:String,
    passwordResetExpires:Date,
    passwordResetVerified:Boolean,
    imgProfile: String,
    phone: String,
    role: {
      type: String,
      enum: ["user", "manager","admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
function handleImageURL(doc) {
  if (doc.imgProfile) {
    const imageURL = `${process.env.BASE_URL}/users/${doc.imgProfile}`;
    doc.imgProfile = imageURL;
  }
}
userSchema.post("init", (doc) => {
  handleImageURL(doc);
});
userSchema.post("save", (doc) => {
  handleImageURL(doc);
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
