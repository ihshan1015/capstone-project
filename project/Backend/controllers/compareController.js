const pool = require('../config/db');

exports.getCompare = async (req, res, next) => {
  try {
    const [compareList] = await pool.query(
      `SELECT c.id as compare_id, p.id, p.name, p.brand, p.price, p.original_price, p.discount_percentage,
       p.image_url, p.capacity, p.energy_rating, p.warranty_years, p.average_rating, p.review_count,
       p.category_id, cat.name as category_name
       FROM comparisons c
       JOIN products p ON c.product_id = p.id
       JOIN categories cat ON p.category_id = cat.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    // Fetch features/pros/cons for each product
    for (const item of compareList) {
      const [features] = await pool.query('SELECT * FROM product_features WHERE product_id = ?', [item.id]);
      item.features = features.filter(f => f.feature_type === 'feature').map(f => f.feature_text);
      item.pros = features.filter(f => f.feature_type === 'pro').map(f => f.feature_text);
      item.cons = features.filter(f => f.feature_type === 'con').map(f => f.feature_text);
    }
    res.status(200).json({ success: true, data: compareList });
  } catch (error) {
    next(error);
  }
};

exports.addToCompare = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'productId is required' });

    const [current] = await pool.query(
      'SELECT c.*, p.category_id FROM comparisons c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [req.user.id]
    );

    if (current.length >= 4) {
      return res.status(400).json({ success: false, message: 'Maximum 4 items allowed in compare list' });
    }

    const [product] = await pool.query('SELECT id, category_id FROM products WHERE id = ?', [productId]);
    if (product.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });

    if (current.length > 0 && current[0].category_id !== product[0].category_id) {
      return res.status(400).json({ success: false, message: 'Can only compare items from the same category' });
    }

    await pool.query('INSERT IGNORE INTO comparisons (user_id, product_id) VALUES (?, ?)', [req.user.id, productId]);
    res.status(201).json({ success: true, message: 'Added to compare list' });
  } catch (error) {
    next(error);
  }
};

exports.removeFromCompare = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM comparisons WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
    res.status(200).json({ success: true, message: 'Removed from compare list' });
  } catch (error) {
    next(error);
  }
};

exports.clearCompare = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM comparisons WHERE user_id = ?', [req.user.id]);
    res.status(200).json({ success: true, message: 'Compare list cleared' });
  } catch (error) {
    next(error);
  }
};
