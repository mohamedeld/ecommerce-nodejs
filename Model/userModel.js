const mongoose = require("mongoose");

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
    password: {
      type: String,
      required: [true, "please enter your password"],
      minLength: [6, "password should be greater than 6"],
    },
    imgProfile: String,
    phone: String,
    role: {
      type: String,
      enum: ["user", "admin"],
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

module.exports = mongoose.model("User", userSchema);
