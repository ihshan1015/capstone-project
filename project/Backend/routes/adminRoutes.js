const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/dashboard', authenticate, authorizeAdmin, adminController.getDashboardStats);
router.get('/users', authenticate, authorizeAdmin, adminController.getUsers);
router.put('/users/:id', authenticate, authorizeAdmin, adminController.updateUserStatus);
router.get('/reviews', authenticate, authorizeAdmin, adminController.getAdminReviews);
router.delete('/reviews/:id', authenticate, authorizeAdmin, adminController.deleteAdminReview);

module.exports = router;
