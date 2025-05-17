const { validationResult } = require('express-validator');
const PantryItem = require('../models/pantryItem');

async function addPantryItem(req, res) {
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
        res.status(500).json({ message: 'Server error while adding the new item' });
    }
}

async function updatePantryItem(req, res) {
    try {
        if (req.body.name) req.body.name = req.body.name.toLowerCase();
        if (req.body.category) req.body.category = req.body.category.toLowerCase();

        const updatedPantryItem = await PantryItem.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPantryItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Pantry item updated successfully',
            item: updatedPantryItem
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating the item' });
    }
}

async function deletePantryItem(req, res) {
    try {
        const deletedPantryItem = await PantryItem.findOneAndDelete({ _id: req.params.id, user: req.userId });

        if (!deletedPantryItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item deleted successfully',
            item: deletedPantryItem
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting the item' });
    }
}

async function getAllPantryItems(req, res) {
    try {
        const allPantryItems = await PantryItem.find({ user: req.userId });
        res.status(200).json({ message: 'Items retrieved successfully', items: allPantryItems });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while retrieving the items' });
    }
}

async function getPantryItemById(req, res) {
    try {
        const pantryItem = await PantryItem.findOne({ _id: req.params.id, user: req.userId });

        if (!pantryItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item retrieved successfully',
            item: pantryItem
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while retrieving the item' });
    }
}

module.exports = { addPantryItem, updatePantryItem, deletePantryItem, getAllPantryItems, getPantryItemById };