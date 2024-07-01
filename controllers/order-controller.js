const Wishlist = require('../models/wishlistModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');

exports.getOrder = async (req, res) => {
  let user = req.session.user;
  req.session.user.discount = null;

  let count = null;
  if (user) {
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
  Order.find({ userId: user._id })
    .populate([
      {
        path: 'orderDetails',
        populate: {
          path: 'product',
          model: 'Product',
        },
      },
    ])
    .sort({ date: -1 })
    .then(order => {
      res.render('user/orders', { user, count, wishcount, order });
    });
};

exports.getOrderDetail = async (req, res) => {
  try {
    let user = req.session.user;
    let id = req.params.id;

    let count = null;
    if (user) {
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
    await Order.findById(id)
      .populate([
        {
          path: 'orderDetails',
          populate: {
            path: 'product',
            model: 'Product',
          },
        },
      ])
      .then(order => {
        res.render('user/order-single-details', {
          user,
          count,
          wishcount,
          order,
        });
      });
  } catch (error) {
    if (error) res.render('user/404');
  }
};

exports.getOrderCancel = async (req, res) => {
  let id = req.params.id;
  Order.findById(id).then(item => {
    item.status = 'cancelled';
    item.save();
    console.log(item + 'updated');
    res.json({ status: true });
  });
};
