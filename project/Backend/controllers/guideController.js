const pool = require('../config/db');

exports.getGuides = async (req, res, next) => {
  try {
    const [guides] = await pool.query(
      `SELECT g.id, g.title, g.slug, g.summary, g.is_published, g.created_at,
       c.name as category_name, c.slug as category_slug
       FROM buying_guides g
       LEFT JOIN categories c ON g.category_id = c.id
       WHERE g.is_published = 1
       ORDER BY g.created_at DESC`
    );
    res.status(200).json({ success: true, data: guides });
  } catch (error) {
    next(error);
  }
};

exports.getGuide = async (req, res, next) => {
  try {
    const idOrSlug = req.params.id;
    const [guides] = await pool.query(
      `SELECT g.*, c.name as category_name, c.slug as category_slug, u.name as author_name
       FROM buying_guides g
       LEFT JOIN categories c ON g.category_id = c.id
       LEFT JOIN users u ON g.author_id = u.id
       WHERE g.id = ? OR g.slug = ?`,
      [idOrSlug, idOrSlug]
    );
    if (guides.length === 0) return res.status(404).json({ success: false, message: 'Guide not found' });
    res.status(200).json({ success: true, data: guides[0] });
  } catch (error) {
    next(error);
  }
};

exports.createGuide = async (req, res, next) => {
  try {
    const { title, category_id, slug, content, summary, is_published } = req.body;
    const author_id = req.user.id;
    const [result] = await pool.query(
      'INSERT INTO buying_guides (title, category_id, slug, content, summary, author_id, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, category_id || null, slug, content, summary || '', author_id, is_published !== undefined ? is_published : 1]
    );
    res.status(201).json({ success: true, message: 'Guide created', data: { id: result.insertId } });
  } catch (error) {
    next(error);
  }
};

exports.updateGuide = async (req, res, next) => {
  try {
    const { title, category_id, slug, content, summary, is_published } = req.body;
    const [existing] = await pool.query('SELECT id FROM buying_guides WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Guide not found' });

    await pool.query(
      'UPDATE buying_guides SET title = ?, category_id = ?, slug = ?, content = ?, summary = ?, is_published = ? WHERE id = ?',
      [title, category_id || null, slug, content, summary || '', is_published !== undefined ? is_published : 1, req.params.id]
    );
    res.status(200).json({ success: true, message: 'Guide updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteGuide = async (req, res, next) => {
  try {
    const [existing] = await pool.query('SELECT id FROM buying_guides WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Guide not found' });
    await pool.query('DELETE FROM buying_guides WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Guide deleted' });
  } catch (error) {
    next(error);
  }
};
