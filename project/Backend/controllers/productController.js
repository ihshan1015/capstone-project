const pool = require('../config/db');
const { getPagination } = require('../utils/helpers');

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, brand, minPrice, maxPrice, energyRating, rating, sort, page, limit } = req.query;
    let query = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
    const params = [];
    const countParams = [];

    if (search) {
      const clause = ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.model_number LIKE ?)';
      query += clause; countQuery += clause;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
      const clause = ' AND p.category_id = ?';
      query += clause; countQuery += clause;
      params.push(category); countParams.push(category);
    }
    if (brand) {
      const clause = ' AND p.brand = ?';
      query += clause; countQuery += clause;
      params.push(brand); countParams.push(brand);
    }
    if (minPrice) {
      const clause = ' AND p.price >= ?';
      query += clause; countQuery += clause;
      params.push(Number(minPrice)); countParams.push(Number(minPrice));
    }
    if (maxPrice) {
      const clause = ' AND p.price <= ?';
      query += clause; countQuery += clause;
      params.push(Number(maxPrice)); countParams.push(Number(maxPrice));
    }
    if (energyRating) {
      const clause = ' AND p.energy_rating >= ?';
      query += clause; countQuery += clause;
      params.push(Number(energyRating)); countParams.push(Number(energyRating));
    }
    if (rating) {
      const clause = ' AND p.average_rating >= ?';
      query += clause; countQuery += clause;
      params.push(Number(rating)); countParams.push(Number(rating));
    }

    if (sort === 'price_asc') query += ' ORDER BY p.price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY p.price DESC';
    else if (sort === 'rating') query += ' ORDER BY p.average_rating DESC';
    else if (sort === 'newest') query += ' ORDER BY p.created_at DESC';
    else if (sort === 'popularity') query += ' ORDER BY p.review_count DESC';
    else query += ' ORDER BY p.created_at DESC';

    const { limit: l, offset: o } = getPagination(page, limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(l, o);

    const [[{ total }], [products]] = await Promise.all([
      pool.query(countQuery, countParams),
      pool.query(query, params)
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: { total, page: Number(page) || 1, limit: l, totalPages: Math.ceil(total / l) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );
    if (products.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
    const product = products[0];

    const [specs] = await pool.query('SELECT spec_key, spec_value FROM product_specifications WHERE product_id = ?', [product.id]);
    const [features] = await pool.query('SELECT feature_type, feature_text FROM product_features WHERE product_id = ?', [product.id]);

    product.specifications = specs;
    product.features = features.filter(f => f.feature_type === 'feature').map(f => f.feature_text);
    product.pros = features.filter(f => f.feature_type === 'pro').map(f => f.feature_text);
    product.cons = features.filter(f => f.feature_type === 'con').map(f => f.feature_text);

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const {
      name, brand, category_id, model_number, price, original_price, discount_percentage,
      image_url, description, capacity, energy_rating, warranty_years, stock_status,
      is_featured, is_popular, features, pros, cons, specifications
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO products (name, brand, category_id, model_number, price, original_price, discount_percentage,
       image_url, description, capacity, energy_rating, warranty_years, stock_status, is_featured, is_popular)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, brand, category_id, model_number || '', price, original_price || price, discount_percentage || 0,
       image_url || '', description || '', capacity || '', energy_rating || 3, warranty_years || 1,
       stock_status || 'in_stock', is_featured ? 1 : 0, is_popular ? 1 : 0]
    );

    const productId = result.insertId;

    // Insert features, pros, cons
    const featureRows = [];
    if (features && Array.isArray(features)) features.forEach(f => featureRows.push([productId, 'feature', f]));
    if (pros && Array.isArray(pros)) pros.forEach(p => featureRows.push([productId, 'pro', p]));
    if (cons && Array.isArray(cons)) cons.forEach(c => featureRows.push([productId, 'con', c]));
    if (featureRows.length > 0) {
      await pool.query('INSERT INTO product_features (product_id, feature_type, feature_text) VALUES ?', [featureRows]);
    }

    // Insert specifications
    if (specifications && Array.isArray(specifications)) {
      const specRows = specifications.map(s => [productId, s.key, s.value]);
      if (specRows.length > 0) {
        await pool.query('INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES ?', [specRows]);
      }
    }

    res.status(201).json({ success: true, message: 'Product created', data: { id: productId } });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const {
      name, brand, category_id, model_number, price, original_price, discount_percentage,
      image_url, description, capacity, energy_rating, warranty_years, stock_status,
      is_featured, is_popular, features, pros, cons, specifications
    } = req.body;

    const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });

    await pool.query(
      `UPDATE products SET name=?, brand=?, category_id=?, model_number=?, price=?, original_price=?,
       discount_percentage=?, image_url=?, description=?, capacity=?, energy_rating=?, warranty_years=?,
       stock_status=?, is_featured=?, is_popular=? WHERE id=?`,
      [name, brand, category_id, model_number || '', price, original_price || price, discount_percentage || 0,
       image_url || '', description || '', capacity || '', energy_rating || 3, warranty_years || 1,
       stock_status || 'in_stock', is_featured ? 1 : 0, is_popular ? 1 : 0, req.params.id]
    );

    // Replace features, pros, cons
    if (features !== undefined || pros !== undefined || cons !== undefined) {
      await pool.query('DELETE FROM product_features WHERE product_id = ?', [req.params.id]);
      const featureRows = [];
      if (features && Array.isArray(features)) features.forEach(f => featureRows.push([req.params.id, 'feature', f]));
      if (pros && Array.isArray(pros)) pros.forEach(p => featureRows.push([req.params.id, 'pro', p]));
      if (cons && Array.isArray(cons)) cons.forEach(c => featureRows.push([req.params.id, 'con', c]));
      if (featureRows.length > 0) {
        await pool.query('INSERT INTO product_features (product_id, feature_type, feature_text) VALUES ?', [featureRows]);
      }
    }

    // Replace specifications
    if (specifications !== undefined) {
      await pool.query('DELETE FROM product_specifications WHERE product_id = ?', [req.params.id]);
      if (specifications && Array.isArray(specifications) && specifications.length > 0) {
        const specRows = specifications.map(s => [req.params.id, s.key, s.value]);
        await pool.query('INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES ?', [specRows]);
      }
    }

    res.status(200).json({ success: true, message: 'Product updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_featured = 1 LIMIT 12'
    );
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getPopularProducts = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_popular = 1 LIMIT 12'
    );
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getBudgetProducts = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.price < 20000 ORDER BY p.price ASC LIMIT 12'
    );
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getBestRatedProducts = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.average_rating DESC, p.review_count DESC LIMIT 12'
    );
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};
