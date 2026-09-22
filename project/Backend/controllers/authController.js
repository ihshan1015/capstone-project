const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashedPassword]
    );
    res.status(201).json({ success: true, message: 'User registered successfully', data: { id: result.insertId, name, email, phone } });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.status(200).json({ success: true, message: 'Login successful', data: { token, user: payload } });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'Profile retrieved', data: users[0] });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    await pool.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, req.user.id]);
    res.status(200).json({ success: true, message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};
