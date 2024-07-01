const express = require('express');
const productRouter = express.Router();

const productController = require('../controllers/product-controller');
const auth = require('../config/auth');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/product-img');
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

let admin;

productRouter.get('/', auth.isAdmin, productController.getProduct);

productRouter.get(
  '/add-product',
  auth.isAdmin,
  productController.getAddProduct
);

productRouter.post(
  '/add-product',
  upload.single('image'),
  productController.postAddProduct
);

productRouter.get(
  '/edit-product/:id',
  auth.isAdmin,
  productController.getEditProduct
);

productRouter.post(
  '/edit-product/:id',
  upload.single('image'),
  productController.postEditProduct
);

productRouter.post(
  '/edit-product/add-gallery/:id',
  upload.array('images', 5),
  productController.postEditProductAddGallery
);

productRouter.get(
  '/edit-product/delete-gallery/:id/:img',
  auth.isAdmin,
  productController.getEditProductAddGallery
);

productRouter.get(
  '/delete-product/:id',
  auth.isAdmin,
  productController.getDeleteProduct
);

module.exports = productRouter;
