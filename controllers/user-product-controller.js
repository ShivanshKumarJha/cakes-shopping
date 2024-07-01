const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Wishlist = require('../models/wishlistModel');

exports.getUserProduct = async (req, res) => {
  let products = await Product.find({});
  let categories = await Category.find({});
  let count = null;
  let list = null;

  const user = req.session.user;
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
    list = await Wishlist.findOne({ userId: req.session.user._id }).populate(
      'wishlist.product'
    );
  }

  res.render('user/products', {
    products,
    categories,
    user,
    count,
    wishcount,
    list,
  });
};

exports.getUserProductCategory = async (req, res) => {
  try {
    let category = req.params.category;
    let categories = await Category.find({});
    let products = await Product.find({ category: category });
    let count = null;
    const user = req.session.user;
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
    console.log(products.length);
    res.render('user/products', {
      products,
      categories,
      user,
      count,
      wishcount,
    });
  } catch (err) {
    if (err) res.render('user/404');
  }
};

exports.getUserProductVegan = async (req, res) => {
  let products = await Product.find({ vegan: true });
  let count = null;
  const user = req.session.user;
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
  console.log(products.length);
  res.render('user/products', { products, user, count, wishcount });
};

exports.getUserProductDetail = async (req, res) => {
  let id = req.params.id;
  try {
    let product = await Product.findById(id);
    let images = product.images;
    const user = req.session.user;
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
    res.render('user/single-product', {
      product,
      images,
      user,
      count,
      wishcount,
    });
  } catch (err) {
    if (err) res.render('user/404');
  }
};
