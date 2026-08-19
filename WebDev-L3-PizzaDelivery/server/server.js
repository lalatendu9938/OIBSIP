require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./routes/orders');
const Razorpay = require('razorpay'); // 👈 1. RAZORPAY IMPORT KIYA

const app = express();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/orders', orderRoutes);

// 👇 2. RAZORPAY KA NAYA ROUTE YAHAN ADD KIYA 👇
app.post('/api/payment/razorpay', async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // Razorpay paise mein deal karta hai (₹1 = 100 paise)
      currency: "INR",
      receipt: "receipt_order_" + Math.random().toString(36).substring(7),
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.json(order);
  } catch (error) {
    console.log("Razorpay Error:", error);
    res.status(500).send(error);
  }
});
// 👆 RAZORPAY ROUTE KHATAM 👆

// Basic Route
app.get('/', (req, res) => {
  res.send('Oasis Pizza Delivery API is running!');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ DB Connection Error: ', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});