const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { productValidation, reviewValidation, handleValidationErrors } = require('../middleware/validate');

router.get('/featured', productController.getFeaturedProducts);
router.get('/popular', productController.getPopularProducts);
router.get('/budget', productController.getBudgetProducts);
router.get('/best-rated', productController.getBestRatedProducts);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', authenticate, authorizeAdmin, productValidation, handleValidationErrors, productController.createProduct);
router.put('/:id', authenticate, authorizeAdmin, productController.updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);

router.get('/:id/reviews', reviewController.getProductReviews);
router.post('/:id/reviews', authenticate, reviewValidation, handleValidationErrors, reviewController.createReview);

module.exports = router;
