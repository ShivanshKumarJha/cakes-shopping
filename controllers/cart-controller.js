const env = require('dotenv').config();
const Razorpay = require('razorpay');

const Product = require('../models/productModel');
const Wishlist = require('../models/wishlistModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

exports.getCart = async (req, res) => {
  let user = req.session.user;
  let id = user._id;
  let carts = await Cart.findOne({ userId: id }).populate('cart.product');
  let coupons = await Coupon.find({});
  let count = null;
  let sum = null;
  let discount = req.session.user.discount;
  if (carts) {
    let cart = carts.cart;
    sum = cart.reduce((sum, x) => {
      return sum + x.sub_total;
    }, 0);
    req.session.user.total = sum;
    console.log(sum);
  }
  let shipping;
  if (sum > 2500) {
    shipping = 0;
  } else {
    shipping = 100;
  }

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
  const error = req.flash('error');
  res.render('user/cart', {
    carts,
    user,
    error,
    count,
    sum,
    shipping,
    wishcount,
    discount,
    coupons,
  });
};

exports.postDiscountCoupon = async (req, res) => {
  let coupon = req.body.coupon;
  console.log(coupon);
  let total = req.session.user.total;
  Coupon.findOne({ coupon: coupon }, (err, c) => {
    if (err) console.log(err);
    if (c) {
      let offer = c.offer;
      let date = new Date();
      let exDate = new Date(c.expiry);
      date = date.getTime();
      exDate = exDate.getTime();
      console.log(date + ' now', exDate + '   exp');
      console.log(c.coupon + ' name');
      if (total >= c.minimum) {
        if (date > exDate) {
          console.log('expired');
          req.flash('error', 'coupon expired!');
          res.json({ status: false });
        } else {
          if (coupon.includes('%')) {
            req.session.user.discount = parseFloat(
              (req.session.user.total * offer) / 100
            ).toFixed(0);
          } else {
            req.session.user.discount = offer;
          }

          res.json({ status: true });
        }
      } else {
        req.flash('error', `Your total amount is less than ${c.minimum}`);
        res.json({ status: false });
      }
    } else {
      req.flash('error', 'Invalid coupon!');
      res.json({ status: false });
    }
  });
};

exports.getAddProduct = async (req, res) => {
  if (req.session.user) {
    let productid = req.params.product;
    console.log(productid);
    let user = req.session.user;
    let product = await Product.findById(productid);
    let price = product.price;
    let id = user._id;
    let userCart = await Cart.findOne({ userId: id });

    if (!userCart) {
      let newcart = new Cart({
        userId: id,
        cart: [
          {
            product: productid,
            quantity: 1,
            price: price,
            sub_total: price,
          },
        ],
      });
      await newcart.save();
    } else {
      await Cart.findOneAndUpdate(
        { userId: id },
        {
          $push: {
            cart: {
              product: productid,
              quantity: 1,
              price: price,
              sub_total: price,
            },
          },
        }
      );

      console.log('new item pushed');
    }

    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
};

exports.getDeleteProduct = async (req, res) => {
  const user = req.session.user;
  const { product, weight } = req.params;
  await Cart.findOneAndUpdate(
    { userId: user._id, 'cart.weight': weight },
    { $pull: { cart: { product: product } } }
  );
  res.json({ status: true });
};

exports.postChangeQuantity = async (req, res) => {
  let user = req.session.user;
  let id = user._id;
  let { proId, wt, price, count, qty } = req.body;
  console.log(proId + ' proid');
  console.log(req.body);
  if (count > 0) {
    Cart.updateOne(
      { userId: id, 'cart.product': proId, 'cart.weight': wt },
      { $inc: { 'cart.$.quantity': count, 'cart.$.sub_total': price } }
    ).then(res => {
      console.log(res + 'updated qty nf total' + proId);
    });
  } else {
    Cart.updateOne(
      { userId: id, 'cart.product': proId, 'cart.weight': wt },
      { $inc: { 'cart.$.quantity': count, 'cart.$.sub_total': -price } }
    ).then(() => {
      console.log('updated qty nf total');
    });
  }

  res.json({ status: true });
};

exports.postChangeWeight = async (req, res) => {
  let id = req.session.user._id;
  let { proId, proprice, cartprice, wt, qty } = req.body;
  console.log(proId, proprice, cartprice, wt, qty);
  proprice = parseInt(proprice);

  if (wt == 0.5) {
    await Cart.updateOne(
      { userId: id, 'cart.product': proId },
      {
        $set: {
          'cart.$.weight': wt,
          'cart.$.price': parseFloat(
            proprice * wt + (proprice * 10) / 100
          ).toFixed(0),
          'cart.$.sub_total':
            qty * parseFloat(proprice * wt + (proprice * 10) / 100).toFixed(0),
        },
      }
    );
  } else if (wt == 2) {
    await Cart.updateOne(
      { userId: id, 'cart.product': proId },
      {
        $set: {
          'cart.$.weight': wt,
          'cart.$.price': parseFloat(
            proprice * wt - (proprice * 10) / 100
          ).toFixed(0),
          'cart.$.sub_total':
            qty * parseFloat(proprice * wt - (proprice * 10) / 100).toFixed(0),
        },
      }
    );
  } else {
    await Cart.updateOne(
      { userId: id, 'cart.product': proId },
      {
        $set: {
          'cart.$.weight': wt,
          'cart.$.price': proprice,
          'cart.$.sub_total': qty * proprice,
        },
      }
    );
  }
  console.log('updated weight');
  res.json({ status: true });
};

exports.getPlaceOrder = async (req, res) => {
  let user = req.session.user;
  let address = await Address.findOne({ userId: user._id });
  console.log(address + ' address');
  let total = req.session.user.total;
  let discount = req.session.user.discount;
  let shipping;
  if (total > 2500) {
    shipping = 0;
  } else {
    shipping = 100;
  }
  console.log(total);
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
  res.render('user/place-order', {
    user,
    count,
    wishcount,
    address,
    total,
    shipping,
    discount,
  });
};

exports.postPlaceOrder = async (req, res) => {
  let addressIndex = req.body.addressIndex;
  let user = req.session.user;
  let address = await Address.findOne({ userId: user._id });
  let change = address.details.map(item => {
    item.select = false;
    return item;
  });
  await Address.findOneAndUpdate(
    { userId: user._id },
    { $pull: { details: {} } }
  ).then(res => {
    console.log(res);
  });
  await Address.findOneAndUpdate(
    { userId: user._id },
    { $push: { details: change } }
  ).then(res => {
    console.log(res);
  });
  Address.findOne({ userId: user._id }).then(res => {
    let item = res.details[addressIndex];
    item.select = true;
    res.save();
  });
  res.json({ status: true });
};

exports.postPayment = async (req, res) => {
  let user = req.session.user;
  let paymentMethod = req.body.payment;
  let total = req.session.user.total;
  let carts = await Cart.findOne({ userId: user._id }).populate('cart.product');
  let address = await Address.findOne({ userId: user._id });
  let selectAddress = address.details.filter(item => {
    return item.select == true;
  });
  let cart = carts.cart;
  console.log(cart + '  vctfygu');

  let shipping;
  if (total > 2500) {
    shipping = 0;
  } else {
    shipping = 100;
  }
  let discount = req.session.user.discount ? req.session.user.discount : 0;
  let status = paymentMethod == 'COD' ? 'placed' : 'pending';

  console.log('orders is not there');

  let order = new Order({
    userId: user._id,
    address: selectAddress[0],
    orderDetails: cart,
    total: total,
    shipping: shipping,
    discount: discount,
    date: new Date(),
    status: status,
    deliveryDate: new Date(+new Date() + 1 * 24 * 60 * 60 * 1000),
  });
  order.save();

  await Cart.findByIdAndUpdate(
    { _id: carts._id },
    { $pull: { cart: {} } }
  ).then(res => {
    console.log(res + 'deleted cart');
  });
  if (status == 'placed') {
    console.log(status + '  sttrts ');
    res.json({ codStatus: status });
  } else if (status == 'pending') {
    let orders = await Order.findById(order._id);

    let options = {
      amount: parseInt(total) * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: '' + orders._id,
    };
    instance.orders.create(options, function (err, order) {
      if (err) console.log(err);
      console.log(order + ' new order');
      console.log(order.receipt + ' new order');
      res.json(order);
    });
  }
};

exports.postVerifyPayment = async (req, res) => {
  console.log('payment vrfctn');
  let data = req.body;
  const crypto = require('crypto');
  let hmac = crypto.createHmac('sha256', 'tbZOzwOin4RoIHaszi12ZhN3');

  hmac.update(
    data['payment[razorpay_order_id]'] +
      '|' +
      data['payment[razorpay_payment_id]']
  );
  hmac = hmac.digest('hex');
  if (hmac == data['payment[razorpay_signature]']) {
    await Order.findById(data['order[receipt]']).then(res => {
      console.log(res);
      res.status = 'placed';
      res.save();
    });
    console.log('updated');
    res.json({ status: true });
  } else {
    res.json({ status: 'Payment failed' });
  }
};

exports.getPlaceOrderSuccess = async (req, res) => {
  let user = req.session.user;
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
  let total = req.session.user.total;
  let shipping;
  if (total > 2500) {
    shipping = 0;
  } else {
    shipping = 100;
  }
  let discount = req.session.user.discount;

  res.render('user/order-success', {
    user,
    count,
    wishcount,
    total,
    shipping,
    discount,
  });
};
