const express = require('express');
const profileRouter = express.Router();

const multer = require('multer');

const Address = require('../models/addressModel');
const auth = require('../config/auth');
const profileController = require('../controllers/profile-controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/user-img');
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

profileRouter.get('/', auth.isUser, profileController.getProfile);

profileRouter.post(
  '/edit-profile',
  auth.isUser,
  upload.single('image'),
  profileController.postEditProfile
);

profileRouter.post(
  '/add-address',
  auth.isUser,
  profileController.postAddAddress
);

profileRouter.post('/edit-address/:index', profileController.postEditAddress);

profileRouter.get('/delete-address/:index', profileController.getDeleteAddress);

profileRouter.post('/change-password', profileController.postChangePassword);

module.exports = profileRouter;
