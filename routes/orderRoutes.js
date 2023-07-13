const express = require('express');
const checkValidator = require('../middleware/checkValidator');
const authController = require('../controller/authController');
const orderController = require('../controller/orderController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/:cartId')
  .post(
    authController.allowedTo('user'),
    checkValidator,
    orderController.createCashOrder
  );
router
  .route('/')
  .get(
    authController.allowedTo('user', 'admin', 'manager'),
    orderController.filterOrderForLoggedUser,
    orderController.getAllOrders
  );
router.route('/:id').get(orderController.getOrder);
router
  .route('/:id/pay')
  .put(authController.allowedTo('admin'), orderController.updateOrderToPaid);
router
  .route('/:id/deliver')
  .put(
    authController.allowedTo('admin'),
    orderController.updateOrderToShipping
  );
router
  .route('/check-session/:cartId')
  .get(authController.allowedTo('user'), orderController.checkSession);

module.exports = router;
