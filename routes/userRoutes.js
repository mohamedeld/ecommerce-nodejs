const express = require("express");
const {
  addUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../middleware/validator/userValidtor");
const checkValidator = require("../middleware/checkValidator");
const authController = require("../controller/authController");
const userController = require("../controller/userController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, userController.getUsers)
  .post(
    authController.protect,
    userController.uploadUserImage,
    userController.resizeUserImage,
    addUserValidator,
    checkValidator,
    userController.addUser
  );

router
  .route("/:id")
  .get(
    authController.protect,
    getUserValidator,
    checkValidator,
    userController.getUser
  )
  .patch(
    authController.protect,
    userController.uploadUserImage,
    userController.resizeUserImage,
    updateUserValidator,
    checkValidator,
    userController.updateUser
  )
  .delete(
    authController.protect,
    deleteUserValidator,
    checkValidator,
    userController.deleteUser
  );
router
  .route("/changePassword/:id")
  .put(
    authController.protect,
    changeUserPasswordValidator,
    checkValidator,
    userController.changeUserPassword
  );
module.exports = router;
