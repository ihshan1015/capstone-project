const pool = require('../config/db');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [products] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [categories] = await pool.query('SELECT COUNT(*) as count FROM categories');
    const [reviews] = await pool.query('SELECT COUNT(*) as count FROM reviews');
    const [guides] = await pool.query('SELECT COUNT(*) as count FROM buying_guides');

    res.status(200).json({
      success: true,
      data: {
        users: users[0].count,
        products: products[0].count,
        categories: categories[0].count,
        reviews: reviews[0].count,
        guides: guides[0].count
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, phone, role, is_active, created_at FROM users');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { is_active, role } = req.body;
    await pool.query('UPDATE users SET is_active = ?, role = ? WHERE id = ?', [is_active, role, req.params.id]);
    res.status(200).json({ success: true, message: 'User updated' });
  } catch (error) {
    next(error);
  }
};

exports.getAdminReviews = async (req, res, next) => {
  try {
    const [reviews] = await pool.query('SELECT r.*, u.name as user_name, p.name as product_name FROM reviews r JOIN users u ON r.user_id = u.id JOIN products p ON r.product_id = p.id ORDER BY r.created_at DESC');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

exports.deleteAdminReview = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Review deleted by admin' });
  } catch (error) {
    next(error);
  }
};
