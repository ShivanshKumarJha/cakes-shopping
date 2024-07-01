const express = require('express');
const wishlistRouter = express.Router();

const auth = require('../config/auth');
const wishlistController = require('../controllers/wishlist-controller');

wishlistRouter.get('/', auth.isUser, wishlistController.getWishlist);

wishlistRouter.get('/add/:product', wishlistController.getWishlistAddProduct);

wishlistRouter.get(
  '/delete/:product',
  auth.isUser,
  wishlistController.getWishlistDeleteProduct
);

module.exports = wishlistRouter;
