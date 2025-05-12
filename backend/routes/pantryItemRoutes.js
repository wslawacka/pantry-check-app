const express = require('express');
const { addPantryItem } = require('../controllers/pantryItemController');
const { pantryItemValidation } = require('../middleware/pantryItemValidator');

const router = express.Router();

router.post('/', pantryItemValidation, addPantryItem);

module.exports = router;