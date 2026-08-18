const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['base', 'sauce', 'cheese', 'veggie'], 
    required: true 
  },
  stock: { type: Number, required: true, default: 100 },
  threshold: { type: Number, required: true, default: 20 }, // Alerts admin if stock < 20
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Ingredient', ingredientSchema);