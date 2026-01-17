import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create Order
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, subtotal, discount, deliveryFee, shippingAddress } = req.body;

    const order = await Order.create({
      userId: req.user.id,
      items,
      subtotal,
      discount,
      deliveryFee,
      total: subtotal - discount + deliveryFee,
      shippingAddress,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
});

// Get User Orders
router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
});

// Get Order Details
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
});

export default router;