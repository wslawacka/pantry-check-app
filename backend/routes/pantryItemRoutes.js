const express = require('express');
const { addPantryItem, updatePantryItem, getAllPantryItems, getPantryItemById, deletePantryItem } = require('../controllers/pantryItemController');
const { pantryItemValidation, pantryItemUpdateValidation } = require('../middleware/pantryItemValidator');
const authenticationMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticationMiddleware, pantryItemValidation, addPantryItem);
router.put('/:id', authenticationMiddleware, pantryItemUpdateValidation, updatePantryItem);
router.get('/', authenticationMiddleware, getAllPantryItems);
router.get('/:id', authenticationMiddleware, getPantryItemById);
router.delete('/:id', authenticationMiddleware, deletePantryItem);

module.exports = router;