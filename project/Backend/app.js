const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const compareRoutes = require('./routes/compareRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const guideRoutes = require('./routes/guideRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' }));

module.exports = app;
