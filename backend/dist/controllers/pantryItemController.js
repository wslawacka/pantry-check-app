"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPantryItem = addPantryItem;
exports.updatePantryItem = updatePantryItem;
exports.deletePantryItem = deletePantryItem;
exports.getAllPantryItems = getAllPantryItems;
exports.getPantryItemById = getPantryItemById;
const express_validator_1 = require("express-validator");
const pantryItem_1 = require("../models/pantryItem");
async function addPantryItem(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { name, category, expiryDate, quantity, barcode } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: no user ID found' });
            return;
        }
        const newPantryItem = new pantryItem_1.PantryItem({
            user: userId,
            name: name.toLowerCase(),
            category: category.toLowerCase(),
            expiryDate,
            quantity
        });
        if (barcode)
            newPantryItem.barcode = barcode;
        const savedPantryItem = await newPantryItem.save();
        if (!savedPantryItem) {
            console.error("Failed to save pantry item:", newPantryItem);
            res.status(500).json({ message: 'Failed to add pantry item' });
            return;
        }
        res.status(201).json({
            message: 'Pantry item added successfully',
            item: savedPantryItem
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while adding the new item' });
    }
}
async function updatePantryItem(req, res) {
    try {
        const updates = req.body;
        if (updates.name)
            updates.name = updates.name.toLowerCase();
        if (updates.category)
            updates.category = updates.category.toLowerCase();
        const updatedPantryItem = await pantryItem_1.PantryItem.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true, runValidators: true });
        if (!updatedPantryItem) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.status(200).json({
            message: 'Pantry item updated successfully',
            item: updatedPantryItem
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating the item' });
    }
}
async function deletePantryItem(req, res) {
    try {
        const deletedPantryItem = await pantryItem_1.PantryItem.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!deletedPantryItem) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.status(200).json({
            message: 'Item deleted successfully',
            item: deletedPantryItem
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting the item' });
    }
}
async function getAllPantryItems(req, res) {
    try {
        const allPantryItems = await pantryItem_1.PantryItem.find({ user: req.userId });
        res.status(200).json({ message: 'Items retrieved successfully', items: allPantryItems });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while retrieving the items' });
    }
}
async function getPantryItemById(req, res) {
    try {
        const pantryItem = await pantryItem_1.PantryItem.findOne({ _id: req.params.id, user: req.userId });
        if (!pantryItem) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.status(200).json({
            message: 'Item retrieved successfully',
            item: pantryItem
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while retrieving the item' });
    }
}
