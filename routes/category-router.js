const express = require('express');
const categoryRouter = express.Router();

const categoryController = require('../controllers/category-controller');
const auth = require('../config/auth');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/category-img');
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

categoryRouter.get('/', auth.isAdmin, categoryController.getCategory);

categoryRouter.get(
  '/add-category',
  auth.isAdmin,
  categoryController.getAddCategory
);

categoryRouter.post(
  '/add-category',
  upload.single('image'),
  categoryController.postAddCategory
);

categoryRouter.get(
  '/edit-category/:id',
  auth.isAdmin,
  categoryController.getEditCategory
);

categoryRouter.post(
  '/edit-category/:id',
  upload.single('image'),
  categoryController.postEditCategory
);

categoryRouter.get(
  '/delete-category/:id',
  auth.isAdmin,
  categoryController.getDeleteCategory
);

module.exports = categoryRouter;
