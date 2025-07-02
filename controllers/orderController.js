const Order = require('../models/Orders');
const Cart = require('../models/Cart');
const Product=require('../models/Product')
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalPrice = cart.items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    const order = new Order({
      user: userId,
      items: cart.items,
      totalPrice,
      shippingAddress,
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Place order failed:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

const getAdminOrders = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Get all product IDs created by this admin
    const adminProducts = await Product.find({ user: adminId }).select('_id');
    const adminProductIds = adminProducts.map(p => p._id.toString());

    // Fetch all orders and populate user and product details
    const orders = await Order.find()
      .populate('user')
      .populate('items.product');

    // Filter orders to keep only those that include at least one admin product
    const filteredOrders = orders
      .map(order => {
        // Filter the items inside each order
        const filteredItems = order.items.filter(item =>
          adminProductIds.includes(item.product._id.toString())
        );

        // If no items from this admin, skip this order
        if (filteredItems.length === 0) return null;

        // Return a copy of the order with only admin's items
        return {
          ...order.toObject(),
          items: filteredItems,
        };
      })
      .filter(order => order !== null);

    res.status(200).json({ orders: filteredOrders });
  } catch (err) {
    console.error("Error in getAdminOrders:", err);
    res.status(500).json({ message: 'Failed to fetch admin orders' });
  }
};


module.exports = { placeOrder, getUserOrders,getAdminOrders };
