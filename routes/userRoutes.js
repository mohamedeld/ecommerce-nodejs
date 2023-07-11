const express = require("express");
const {
  addUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserDataWithoutPassword,
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
  .route('/getMe')
  .get(
    authController.protect,
    userController.getLoggedUserData,
    userController.getUser
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

router
  .route("/changeMyPassword")
  .put(authController.protect, userController.updateLoggedUserPassword);

router
  .route("/updateMe")
  .put(authController.protect,
    updateLoggedUserDataWithoutPassword,userController.updateLoggedUserDataWithoutPassword
  );
router.route("/deactivate").delete(userController.deActivateUser);
module.exports = router;
