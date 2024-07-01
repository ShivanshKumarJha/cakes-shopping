const express = require('express');
const orderRouter = express.Router();

const orderController = require('../controllers/order-controller');
const auth = require('../config/auth');

orderRouter.get('/', auth.isUser, orderController.getOrder);

orderRouter.get(
  '/order-details/:id',
  auth.isUser,
  orderController.getOrderDetail
);

orderRouter.get('/order-cancel/:id', orderController.getOrderCancel);

module.exports = orderRouter;
