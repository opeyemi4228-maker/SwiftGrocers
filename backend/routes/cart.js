import express from 'express';
import Cart from '../models/Cart.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get Cart
router.get('/', protect, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});

// Add to Cart
router.post('/add', protect, async (req, res, next) => {
  try {
    const { productId, quantity, name, price, image } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, name, price, image });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});

// Remove from Cart
router.post('/remove', protect, async (req, res, next) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});

export default router;