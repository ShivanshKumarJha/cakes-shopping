const express = require('express');
const userProductRouter = express.Router();

const auth = require('../config/auth');
const userProductController = require('../controllers/user-product-controller');

userProductRouter.get('/', userProductController.getUserProduct);

userProductRouter.get(
  '/:category',
  userProductController.getUserProductCategory
);

userProductRouter.get('/vegan', userProductController.getUserProductVegan);

userProductRouter.get(
  '/product-details/:id',
  userProductController.getUserProductDetail
);

module.exports = userProductRouter;
