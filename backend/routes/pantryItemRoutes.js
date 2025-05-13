const express = require('express');
const { addPantryItem } = require('../controllers/pantryItemController');
const { pantryItemValidation } = require('../middleware/pantryItemValidator');
const authenticationMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticationMiddleware, pantryItemValidation, addPantryItem);

module.exports = router;