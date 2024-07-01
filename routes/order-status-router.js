const express = require('express');
const orderStatusRouter = express.Router();

const auth = require('../config/auth');
const orderStatusController = require('../controllers/order-status-controller');

orderStatusRouter.get('/', auth.isAdmin, orderStatusController.getOrderStatus);

orderStatusRouter.post(
  '/change-status/:id',
  auth.isAdmin,
  orderStatusController.postOrderChangeStatus
);

module.exports = orderStatusRouter;
