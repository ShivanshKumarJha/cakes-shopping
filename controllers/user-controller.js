const bcrypt = require('bcrypt');
const env = require('dotenv').config();

const User = require('../models/userModel');
const Banner = require('../models/bannerModel');
const Address = require('../models/addressModel');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const EmailVerification = require('../models/userEmailverificationModel');
const Otp = require('../models/userPasswordResetModel');
const Wishlist = require('../models/wishlistModel');

const {
  sendVerificationEmail,
  sendPasswordResetOtp,
} = require('../config/nodemailer');

const securePassword = async password => {
  const passwordHash = await bcrypt.hash(password, 10);
  return passwordHash;
};

exports.getUser = async (req, res) => {
  const user = req.session.user;

  const banners = await Banner.find({});
  const categories = await Category.find({});
  const specials = await Product.find({ special: true });
  let count = null;
  if (user) {
    req.session.user.discount = null;

    const cartItems = await Cart.findOne({ userId: user._id });

    if (cartItems) {
      count = cartItems.cart.length;
    }
  }
  let wishcount = null;

  if (user) {
    const wishlistItems = await Wishlist.findOne({ userId: user._id });

    if (wishlistItems) {
      wishcount = wishlistItems.wishlist.length;
    }
  }
  console.log(count);
  res.render('user/homepage', {
    user,
    banners,
    categories,
    specials,
    count,
    wishcount,
  });
};

exports.getUserRegister = (req, res) => {
  if (req.session.user) res.redirect('/home');
  else {
    const error = req.flash('error');
    const success = req.flash('success');

    res.render('user/signup', { error: error, success: success });
  }
};

exports.postUserRegister = async (req, res) => {
  const { name, email, contact, password, image } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    req.flash(
      'error',
      `This Email is already registered  in the name '${user.name}'`
    );
    return res.redirect('/register');
  }
  const spassword = await securePassword(password);
  user = new User({
    name: name,
    email: email,
    contact: contact,
    password: spassword,
    verified: false,
    image: image,
    status: false,
  });

  user
    .save()
    .then(result => {
      let address = new Address({
        userId: result._id,
        details: [],
      });
      address.save(() => {
        sendVerificationEmail(result, res);
        console.log(result);

        req.flash(
          'success',
          'Verification email has been sent. please check your email at https://mail.google.com/mail'
        );
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getUserVerify = async (req, res) => {
  let { userId, uniqueString } = req.query;
  console.log(userId);
  console.log(uniqueString);
  EmailVerification.find({ userId })

    .then(result => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hashedString = result[0].uniqueString;
        if (expiresAt < Date.now()) {
          console.log('expired');
          EmailVerification.findOneAndDelete({ userId })
            .then(result => {
              User.findByIdAndDelete({ _id: userId })
                .then(() => {
                  console.log('signup again due to expired link');
                  req.flash(
                    'error',
                    `Your verification link has expired.Signup again`
                  );

                  res.redirect('/register');
                })
                .catch(error => {
                  console.log('err in user deletion');
                });
            })
            .catch(error => {
              console.log(error);
              console.log('err in email deletion');
            });
        } else {
          bcrypt
            .compare(uniqueString, hashedString)
            .then(result => {
              if (result) {
                User.updateOne({ _id: userId }, { $set: { verified: true } })
                  .then(() => {
                    EmailVerification.deleteMany({ userId })
                      .then(() => {
                        req.flash(
                          'success',
                          'Your email has been verified.Go and Login now !'
                        );

                        res.redirect('/login');
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  })
                  .catch(error => {
                    console.log(error);
                  });
              } else {
                req.flash(
                  'error',
                  `Verification link is not valid.Signup again.`
                );

                res.redirect('/register');
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      } else {
        req.flash('error', `No registered User found`);

        res.redirect('/register');
      }
    })
    .catch(error => {
      console.log(error);
      console.log('error in find');
    });
};

exports.getUserLogin = (req, res) => {
  req.session.account = null;
  if (req.session.user) {
    res.redirect('/');
  } else {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('user/login', { error: error, success: success });
  }
};

exports.postUserLogin = async (req, res) => {
  const { email, password } = req.body;

  const userData = await User.findOne({ email });

  if (!userData) {
    req.flash('error', 'No User found!');
    return res.redirect('/login');
  }
  const passwordMatch = await bcrypt.compare(password, userData.password);
  if (!passwordMatch) {
    req.flash('error', 'Your Password is wrong!');

    return res.redirect('/login');
  }
  if (userData.verified !== true) {
    req.flash(
      'error',
      'Your email is not verified! Go to your inbox and verify.'
    );

    return res.redirect('/login');
  }
  if (userData.status) {
    req.flash('error', 'Your account is blocked by admin.');

    return res.redirect('/login');
  }
  req.session.user = userData;

  res.redirect('/');
};

exports.getUserForgotPassword = async (req, res) => {
  let error = req.flash('error');
  let success = req.flash('success');
  let account = null;
  if (req.session.account) {
    account = req.session.account;
  }
  res.render('user/forgot-password', { error, success, account });
};

exports.postUserCheckEmail = async (req, res) => {
  let email = req.body.email;
  await User.findOne({ email: email }).then(async account => {
    if (account) {
      req.session.account = account;
      await sendPasswordResetOtp(account, res)
        .then(() => {
          req.flash('success', 'OTP has been sent. Check your email.');
          res.redirect('/forgot-password');
        })
        .catch(error => {
          req.flash('error', 'OTP has not been sent.');
          res.redirect('/forgot-password');
        });
    } else {
      req.flash('error', 'No user found');
      res.redirect('/forgot-password');
    }
  });
};

exports.getUserResendOtp = async (req, res) => {
  await sendPasswordResetOtp(req.session.account, res);
  res.redirect('/forgot-password');
};

exports.postUserVerifyOtp = async (req, res) => {
  let bodyotp = req.body.otp;
  // let otp = await securePassword(bodyotp);
  let id = req.params.id;
  console.log(bodyotp);
  Otp.find({ userId: id })

    .then(result => {
      if (result.length > 0) {
        const { expiresAt } = result[result.length - 1];
        console.log(expiresAt);
        const sentOtp = result[result.length - 1].otp;
        if (expiresAt < Date.now()) {
          console.log('expired');
          Otp.findOneAndDelete({ userId: id })
            .then(result => {
              req.flash('error', 'OTP has expired,try again.');
              res.redirect('/forgot-Password');
            })
            .catch(error => {
              console.log(error);
              console.log('err in email deletion');
            });
        } else {
          console.log(bodyotp + '  ' + sentOtp);

          if (bodyotp == sentOtp) {
            Otp.deleteMany({ userId: id });
            req.session.account.otp = true;
            req.flash('success', 'Now update your password');
            res.redirect('/forgot-password');
          } else {
            req.flash('error', `Otp is invalid.`);

            res.redirect('/forgot-password');
          }
        }
      } else {
        req.flash('error', `No registered User found`);

        res.redirect('/forgot-password');
      }
    })
    .catch(error => {
      console.log(error);
      console.log('error in find');
    });
};

exports.postUserChangePassword = async (req, res) => {
  let { npassword } = req.body;
  let id = req.params.id;
  let spassword = await securePassword(npassword);
  console.log(id);
  await User.findById(id, async (err, user) => {
    console.log(user);
    user.password = spassword;
    await user.save();
    req.flash('success', 'Password changed successfully');
    res.redirect('/login');
  }).clone();
};

exports.getUserAbout = async (req, res) => {
  const user = req.session.user;

  let count = null;
  if (user) {
    req.session.user.discount = null;

    const cartItems = await Cart.findOne({ userId: user._id });

    if (cartItems) {
      count = cartItems.cart.length;
    }
  }
  let wishcount = null;

  // let t = await Cart.findOne({ userId: id }).populate("cart.product");
  if (user) {
    const wishlistItems = await Wishlist.findOne({ userId: user._id });

    if (wishlistItems) {
      wishcount = wishlistItems.wishlist.length;
    }
  }
  res.render('user/about', { user, count, wishcount });
};

exports.getUserContact = async (req, res) => {
  const user = req.session.user;

  let count = null;
  if (user) {
    req.session.user.discount = null;

    const cartItems = await Cart.findOne({ userId: user._id });

    if (cartItems) {
      count = cartItems.cart.length;
    }
  }
  let wishcount = null;

  // let t = await Cart.findOne({ userId: id }).populate("cart.product");
  if (user) {
    const wishlistItems = await Wishlist.findOne({ userId: user._id });

    if (wishlistItems) {
      wishcount = wishlistItems.wishlist.length;
    }
  }
  res.render('user/contact', { user, count, wishcount });
};

exports.postUserSearch = async (req, res) => {
  let payload = req.body.payload.trim();
  let search = await Product.find({
    title: { $regex: new RegExp(payload + '.*', 'i') },
  }).exec();
  search = search.slice(0, 10);
  console.log(payload);
  res.json({ payload: search });
};

exports.getUserLogout = (req, res) => {
  req.session.user = null;
  req.flash('success', 'You are logged out successfully!');
  res.redirect('/login');
};
