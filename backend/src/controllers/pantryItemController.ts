import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PantryItem } from '../models/pantryItem';
import { PantryItemCreate, PantryItemUpdate } from '../../types/pantry';

export async function addPantryItem(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { name, category, expiryDate, quantity, barcode } = req.body as PantryItemCreate;

        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: no user ID found' });
            return;
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
            res.status(500).json({ message: 'Failed to add pantry item' });
            return;
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

export async function updatePantryItem(req: Request, res: Response): Promise<void> {
    try {
        const updates = req.body as PantryItemUpdate;
        if (updates.name) updates.name = updates.name.toLowerCase();
        if (updates.category) updates.category = updates.category.toLowerCase();


        const updatedPantryItem = await PantryItem.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPantryItem) {
            res.status(404).json({ message: 'Item not found' });
            return;
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

export async function deletePantryItem(req: Request, res: Response): Promise<void> {
    try {
        const deletedPantryItem = await PantryItem.findOneAndDelete({ _id: req.params.id, user: req.userId });

        if (!deletedPantryItem) {
            res.status(404).json({ message: 'Item not found' });
            return;
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

export async function getAllPantryItems(req: Request, res: Response): Promise<void> {
    try {
        const allPantryItems = await PantryItem.find({ user: req.userId });
        res.status(200).json({ message: 'Items retrieved successfully', items: allPantryItems });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while retrieving the items' });
    }
}

export async function getPantryItemById(req: Request, res: Response): Promise<void> {
    try {
        const pantryItem = await PantryItem.findOne({ _id: req.params.id, user: req.userId });

        if (!pantryItem) {
            res.status(404).json({ message: 'Item not found' });
            return;
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