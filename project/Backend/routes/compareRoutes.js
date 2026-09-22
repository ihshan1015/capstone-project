const express = require('express');
const router = express.Router();
const compareController = require('../controllers/compareController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, compareController.getCompare);
router.post('/', authenticate, compareController.addToCompare);
router.delete('/clear', authenticate, compareController.clearCompare);
router.delete('/:productId', authenticate, compareController.removeFromCompare);

module.exports = router;
