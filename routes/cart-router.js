const express = require('express');
const cartRouter = express.Router();

const cartController = require('../controllers/cart-controller');
const auth = require('../config/auth');

cartRouter.get('/', auth.isUser, cartController.getCart);

cartRouter.post('/discount-coupon', cartController.postDiscountCoupon);

cartRouter.get('/add/:product', cartController.getAddProduct);

cartRouter.get(
  '/delete/:product/:weight',
  auth.isUser,
  cartController.getDeleteProduct
);

cartRouter.post(
  '/change-quantity',
  auth.isUser,
  cartController.postChangeQuantity
);

cartRouter.post('/change-weight', auth.isUser, cartController.postChangeWeight);

cartRouter.get('/place-order', auth.isUser, cartController.getPlaceOrder);

cartRouter.post(
  '/place-order/select-address',
  auth.isUser,
  cartController.postPlaceOrder
);

cartRouter.post('/payment', auth.isUser, cartController.postPayment);

cartRouter.post('/verify-payment', cartController.postVerifyPayment);

cartRouter.get(
  '/place-order/success',
  auth.isUser,
  cartController.getPlaceOrderSuccess
);

module.exports = cartRouter;
