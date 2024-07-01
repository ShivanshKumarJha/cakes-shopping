const Order = require('../models/orderModel');

exports.getOrderStatus = async (req, res) => {
  let admin = req.session.admin;
  let count = await Order.count();
  let orders = await Order.find({}).populate([
    { path: 'userId', model: 'User' },
    {
      path: 'orderDetails',
      populate: {
        path: 'product',
        model: 'Product',
      },
    },
  ]);
  // .sort({ date: -1 });

  let success = req.flash('success');
  let error = req.flash('error');
  let status = ['placed', 'shipped', 'cancelled', 'delivered'];
  res.render('admin/orders', { admin, count, orders, success, error, status });
};

exports.postOrderChangeStatus = async (req, res) => {
  let { status } = req.body;
  let id = req.params.id;
  console.log(status, id);
  await Order.findById(id).then(order => {
    order.status = status;
    order.save();
    res.json({ status: true });
  });
};
