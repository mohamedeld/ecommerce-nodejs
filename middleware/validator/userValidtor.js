const { param, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const User = require("../../Model/userModel");

module.exports.addUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("please enter your name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("email")
    .notEmpty()
    .withMessage("please enter your email")
    .isEmail()
    .withMessage(" invalid email ")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already in use"));
        }
      })
    ),
  body("password")
    .isStrongPassword()
    .withMessage("please enter your strong password")
    .isLength({ min: 6 })
    .withMessage("your password should greater than 6")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("password confirm is not equal");
      }
      return true;
    }),
  body("confirmPassword")
    .isStrongPassword()
    .withMessage("please enter your confirm password correctly "),
  body("role")
    .notEmpty()
    .withMessage("please enter your role")
    .isIn(["user", "admin"])
    .withMessage("Role should be either 'user' or 'admin'"),
  body("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("invalid phone number"),
];

module.exports.getUserValidator = [
  param("id").isMongoId().withMessage("user id should be mongo id"),
];

module.exports.updateUserValidator = [
  body("name")
    .optional()
    .isEmpty()
    .withMessage("please enter your name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("email")
    .isEmpty()
    .withMessage("please enter your email")
    .isEmail()
    .withMessage("please enter your email ")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          throw new Error("invalid id ");
        }
      })
    ),
  body("password")
    .optional()
    .isEmpty()
    .withMessage("please enter your password"),
  body("role").optional().isEmpty().withMessage("please enter your role"),
  body("imgProfile")
    .optional()
    .notEmpty()
    .withMessage("please enter your image"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("please enter your phone"),
];

module.exports.changeUserPasswordValidator = [
  param("id")
    .notEmpty()
    .withMessage("please enter your id ")
    .isMongoId()
    .withMessage("id should be mongo id "),
  body("currentPassword")
    .notEmpty()
    .withMessage("please enter your current password"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("please enter your confirm password"),
  body("password")
    .notEmpty()
    .withMessage("please enter confirm of password")
    .custom(async (password, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("invalid id of user");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("incorrect password");
      }

      if (password !== req.body.confirmPassword) {
        throw new Error("invalid confirm password");
      }
      return true;
    }),
];
module.exports.updateLoggedUserDataWithoutPassword = [
  body("name")
    .optional()
    .isEmpty()
    .withMessage("please enter your name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("email")
    .isEmpty()
    .withMessage("please enter your email")
    .isEmail()
    .withMessage("please enter your email ")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          throw new Error("invalid id ");
        }
      })
    ),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("please enter your phone"),
];
module.exports.deleteUserValidator = [
  param("id").isMongoId().withMessage("user id should be mongo id"),
];
