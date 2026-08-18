const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post('/', async (req, res) => {
  try {
    const { user, userId, pizzaDetails, deliveryAddress, totalAmount, paymentMethod, status } = req.body;
    
    const customerId = user || userId;

    const newOrder = new Order({
      user: customerId,
      pizzaDetails: pizzaDetails,
      totalAmount: totalAmount,
      deliveryAddress: deliveryAddress,
      status: status || 'Order Received',
      paymentStatus: paymentMethod === 'cod' ? 'Pending (COD)' : 'Completed (Simulated)',
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order Placed Successfully', order: newOrder });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error while placing order', error: error.message });
  }
});

router.post('/create-razorpay-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
    };
    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).send('Some error occurred while creating order');
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send(error);
  }
});

router.post('/verify-and-save', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, pizzaDetails, totalAmount, userId, deliveryAddress } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(sign.toString()).digest('hex');

    if (razorpay_signature === expectedSign) {
      const newOrder = new Order({
        user: userId, 
        pizzaDetails: pizzaDetails,
        totalAmount: totalAmount,
        deliveryAddress: deliveryAddress,
        status: 'Order Received',
        paymentStatus: 'Completed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });
      await newOrder.save(); 
      return res.status(200).json({ message: 'Payment verified and Order Saved successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid signature sent!' });
    }
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).send(error);
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

router.get('/admin/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

router.put('/admin/update-status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;