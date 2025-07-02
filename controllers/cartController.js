const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();


const addItemToCart=async (req, res) => {
  const {productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Item added', cart });
  } catch (err) {
    console.error('Add to cart failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getItemByUserId=async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id})
      .populate('items.product');
    
    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
}
const IncrementOrDecrementItem= async (req, res) => {
  const { action } = req.body; // 'increment' or 'decrement'

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.find(item => item.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (action === 'increment') {
      item.quantity += 1;
    } else if (action === 'decrement') {
      item.quantity = Math.max(1, item.quantity - 1);
    }

    await cart.save();
    res.status(200).json({ message: 'Quantity updated', cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
};

const deleteItem= async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id});
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();

    res.status(200).json({ message: 'Item removed', cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
}

const clearCart= async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
}
module.exports={addItemToCart,getItemByUserId,IncrementOrDecrementItem,deleteItem,clearCart};