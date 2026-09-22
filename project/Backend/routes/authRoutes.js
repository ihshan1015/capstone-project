const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerValidation, loginValidation, handleValidationErrors } = require('../middleware/validate');

router.post('/register', registerValidation, handleValidationErrors, authController.register);
router.post('/login', loginValidation, handleValidationErrors, authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
