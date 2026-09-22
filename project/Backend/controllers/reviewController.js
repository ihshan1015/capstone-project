const pool = require('../config/db');

exports.getProductReviews = async (req, res, next) => {
  try {
    const [reviews] = await pool.query(
      'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC',
      [req.params.id]
    );
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => distribution[r.rating]++);
    res.status(200).json({ success: true, data: reviews, distribution });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { rating, title, review_text } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    const [existing] = await pool.query('SELECT id FROM reviews WHERE product_id = ? AND user_id = ?', [productId, userId]);
    if (existing.length > 0) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });

    await pool.query(
      'INSERT INTO reviews (product_id, user_id, rating, title, review_text) VALUES (?, ?, ?, ?, ?)',
      [productId, userId, rating, title || '', review_text || '']
    );

    // Recalculate average rating and review count
    await pool.query(
      'UPDATE products SET average_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE product_id = ?), review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?) WHERE id = ?',
      [productId, productId, productId]
    );

    res.status(201).json({ success: true, message: 'Review created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { rating, title, review_text } = req.body;
    const [review] = await pool.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (review.length === 0) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review[0].user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    await pool.query(
      'UPDATE reviews SET rating = ?, title = ?, review_text = ? WHERE id = ?',
      [rating, title, review_text, req.params.id]
    );

    const productId = review[0].product_id;
    await pool.query(
      'UPDATE products SET average_rating = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE product_id = ?), review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?) WHERE id = ?',
      [productId, productId, productId]
    );
    res.status(200).json({ success: true, message: 'Review updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const [review] = await pool.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (review.length === 0) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    const productId = review[0].product_id;
    await pool.query(
      'UPDATE products SET average_rating = COALESCE((SELECT ROUND(AVG(rating),2) FROM reviews WHERE product_id = ?), 0), review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?) WHERE id = ?',
      [productId, productId, productId]
    );

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
