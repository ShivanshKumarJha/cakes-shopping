const express = require('express');
const adminRouter = express.Router();

const auth = require('../config/auth');
const adminController = require('../controllers/admin-controller');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/banner-img');
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

adminRouter.get('/', adminController.getAdminLogin);

adminRouter.post('/', adminController.postAdminLogin);

adminRouter.get('/dashboard', auth.isAdmin, adminController.getDashboard);

adminRouter.get('/chart', adminController.getChart);

adminRouter.get('/logout', adminController.getAdminLogout);

adminRouter.get('/banner', auth.isAdmin, adminController.getBanner);

adminRouter.get(
  '/banner/add-banner',
  auth.isAdmin,
  adminController.getAddBanner
);

adminRouter.post(
  '/banner/add-banner',
  upload.single('banner'),
  adminController.postAddBanner
);

adminRouter.get(
  '/banner/edit-banner/:id',
  auth.isAdmin,
  adminController.getEditBanner
);

adminRouter.post(
  '/banner/edit-banner/:id',
  upload.single('banner'),
  adminController.postEditBanner
);

adminRouter.get(
  '/banner/delete/:id',
  auth.isAdmin,
  adminController.getDeleteBanner
);

adminRouter.get('/users', auth.isAdmin, adminController.getUsers);

adminRouter.get('/users/block/:id', auth.isAdmin, adminController.getUserBlock);

adminRouter.get(
  '/users/unblock/:id',
  auth.isAdmin,
  adminController.getUserUnblock
);

adminRouter.get('/not', adminController.getNot);

module.exports = adminRouter;
