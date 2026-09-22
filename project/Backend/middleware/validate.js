const { check, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

const productValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('price', 'Price must be a number').isNumeric()
];

const reviewValidation = [
  check('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('review_text', 'Review text is required').not().isEmpty()
];

const guideValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('content', 'Content is required').not().isEmpty()
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  productValidation,
  reviewValidation,
  guideValidation
};
