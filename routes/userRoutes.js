const express = require("express");
const {
  addUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../middleware/validator/userValidtor");
const checkValidator = require("../middleware/checkValidator");

const userController = require("../controller/userController.js");

const router = express.Router();

router
  .route("/")
  .get(userController.getUsers)
  .post(
    userController.uploadUserImage,
    userController.resizeUserImage,
    addUserValidator,
    checkValidator,
    userController.addUser
  );

router
  .route("/:id")
  .get(getUserValidator, checkValidator, userController.getUser)
  .patch(
    userController.uploadUserImage,
    userController.resizeUserImage,
    updateUserValidator,
    checkValidator,
    userController.updateUser
  )
  .delete(deleteUserValidator, checkValidator, userController.deleteUser);

module.exports = router;