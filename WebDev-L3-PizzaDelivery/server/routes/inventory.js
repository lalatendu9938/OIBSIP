const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

// @route GET /api/inventory
// @desc Get all ingredients (grouped for the pizza builder)
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching inventory' });
  }
});

// @route POST /api/inventory
// @desc Add a new ingredient (Admin only - we will add auth middleware later)
router.post('/', async (req, res) => {
  try {
    const { name, category, stock, threshold, price } = req.body;

    const newIngredient = new Ingredient({
      name,
      category,
      stock,
      threshold,
      price
    });

    await newIngredient.save();
    res.status(201).json({ message: 'Ingredient added successfully', newIngredient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding ingredient' });
  }
});

module.exports = router;