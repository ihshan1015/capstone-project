const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { guideValidation, handleValidationErrors } = require('../middleware/validate');

router.get('/', guideController.getGuides);
router.get('/:id', guideController.getGuide);
router.post('/', authenticate, authorizeAdmin, guideValidation, handleValidationErrors, guideController.createGuide);
router.put('/:id', authenticate, authorizeAdmin, guideController.updateGuide);
router.delete('/:id', authenticate, authorizeAdmin, guideController.deleteGuide);

module.exports = router;
