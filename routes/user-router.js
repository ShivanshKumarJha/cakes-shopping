const express = require('express');
const userRouter = express.Router();

const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const env = require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const EmailVerification = require('../models/userEmailverificationModel');
const Otp = require('../models/userPasswordResetModel');
const userController = require('../controllers/user-controller');

const securePassword = async password => {
  const passwordHash = await bcrypt.hash(password, 10);
  return passwordHash;
};
const secureString = async uniqueString => {
  const stringHash = await bcrypt.hash(uniqueString, 10);
  return stringHash;
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((err, success) => {
  if (err) console.log(err);
  else {
    console.log('ready for messages');
    console.log(success);
  }
});

const sendVerificationEmail = async ({ _id, email }, res) => {
  try {
    const url = 'http://localhost:4000/';
    const uniqueString = uuidv4();
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: 'cakesNbakes : verify email',
      html: `<p>Please verify your email to complete the registration process of cakesNbakes.
             Click <a href="${
               url + 'verify?userId=' + _id + '&uniqueString=' + uniqueString
             }">here</a> to verify.
             <p>This link will <b>expire in 2 hrs</b>.</p>`,
    };
    const hashedString = await secureString(uniqueString);
    const newEmailVerification = await new EmailVerification({
      userId: _id,
      uniqueString: hashedString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 2,
    });
    await newEmailVerification.save();
    await transporter.sendMail(mailOptions);

    res.redirect('/register');
  } catch (error) {
    console.log('email not sent');
    console.log(error);
  }
};

const sendPasswordResetOtp = async ({ _id, email }, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log(otp + '  otp');
    const mailOptions = {
      from: 'shivanshkumarjha07@gmail.com',
      to: email,
      subject: 'Password reset',
      html: `<p>Your OTP is : ${otp}.</p><p>This will <b>expire in 3 minutes</b>.</p>`,
    };
    const newOtp = new Otp({
      userId: _id,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 3,
    });
    await newOtp.save();
    console.log('otp saved');

    await transporter.sendMail(mailOptions);
    console.log('otp sent');
  } catch (error) {
    console.log(' otp email not sent');
    console.log(error);
  }
};

userRouter.get('/', userController.getUser);

userRouter.get('/register', userController.getUserRegister);

userRouter.post('/register', userController.postUserRegister);

userRouter.get('/verify', userController.getUserVerify);

userRouter.get('/login', userController.getUserLogin);

userRouter.post('/login', userController.postUserLogin);

userRouter.get('/forgot-password', userController.getUserForgotPassword);

userRouter.post('/check-email', userController.postUserCheckEmail);

userRouter.get('/resend-otp', userController.getUserResendOtp);

userRouter.post('/verify-otp/:id', userController.postUserVerifyOtp);

userRouter.post('/change-password/:id', userController.postUserChangePassword);

userRouter.get('/about', userController.getUserAbout);

userRouter.get('/contact', userController.getUserContact);

userRouter.post('/search', userController.postUserSearch);

userRouter.get('/logout', userController.getUserLogout);

module.exports = userRouter;
