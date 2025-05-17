import express from 'express';
import { addPantryItem, updatePantryItem, getAllPantryItems, getPantryItemById, deletePantryItem } from '../controllers/pantryItemController';
import { pantryItemValidation, pantryItemUpdateValidation } from '../middleware/pantryItemValidator';
import { authMiddleware } from '../middleware/authMiddleware';

export const pantryRoutes = express.Router();

pantryRoutes.post('/', authMiddleware, pantryItemValidation, addPantryItem);
pantryRoutes.put('/:id', authMiddleware, pantryItemUpdateValidation, updatePantryItem);
pantryRoutes.get('/', authMiddleware, getAllPantryItems);
pantryRoutes.get('/:id', authMiddleware, getPantryItemById);
pantryRoutes.delete('/:id', authMiddleware, deletePantryItem);