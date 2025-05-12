const { validationResult } = require('express-validator');
const PantryItem = require('../models/pantryItem');

async function addPantryItem(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, category, expiryDate, quantity, barcode } = req.body;

        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: no user ID found' });
        }

        const newPantryItem = new PantryItem({
            user: userId,
            name: name.toLowerCase(),
            category: category.toLowerCase(),
            expiryDate,
            quantity
        });
        if (barcode) newPantryItem.barcode = barcode;

        const savedPantryItem = await newPantryItem.save();
        if (!savedPantryItem) {
            console.error("Failed to save pantry item:", newPantryItem);
            return res.status(500).json({ message: 'Failed to add pantry item' });
        }

        res.status(201).json({
            message: 'Pantry item added successfully',
            item: savedPantryItem
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during adding the new item' });
    }
}

module.exports = { addPantryItem };