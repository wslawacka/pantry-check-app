const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../middleware/userValidator');

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

module.exports = router;