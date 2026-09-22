const pool = require('../config/db');

exports.getWishlist = async (req, res, next) => {
  try {
    const [wishlist] = await pool.query('SELECT w.*, p.name, p.price, p.image_url FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?', [req.user.id]);
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await pool.query('INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.user.id, productId]);
    res.status(201).json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
    res.status(200).json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};
