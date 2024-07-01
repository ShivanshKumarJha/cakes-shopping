const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const env = require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const EmailVerification = require('../models/userEmailverificationModel');
const Otp = require('../models/userPasswordResetModel');

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

const secureString = async uniqueString => {
  const stringHash = await bcrypt.hash(uniqueString, 10);
  return stringHash;
};

exports.sendVerificationEmail = async ({ _id, email }, res) => {
  try {
    const url = 'https://cake-n-bakes-shopping.onrender.com/';
    const uniqueString = uuidv4();
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: 'cakesNbakes : Verify Email',
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

exports.sendPasswordResetOtp = async ({ _id, email }, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log(otp + '  otp');
    const mailOptions = {
      from: 'h92159918@gmail.com',
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
