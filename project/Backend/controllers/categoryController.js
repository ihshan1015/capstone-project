const pool = require('../config/db');

exports.getCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query('SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count FROM categories c');
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const [categories] = await pool.query('SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count FROM categories c WHERE c.id = ?', [req.params.id]);
    if (categories.length === 0) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, data: categories[0] });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image_url } = req.body;
    const [result] = await pool.query('INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)', [name, description, image_url]);
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, image_url } = req.body;
    await pool.query('UPDATE categories SET name = ?, description = ?, image_url = ? WHERE id = ?', [name, description, image_url, req.params.id]);
    res.status(200).json({ success: true, message: 'Category updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const [products] = await pool.query('SELECT id FROM products WHERE category_id = ? LIMIT 1', [req.params.id]);
    if (products.length > 0) return res.status(400).json({ success: false, message: 'Cannot delete category with products' });
    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
