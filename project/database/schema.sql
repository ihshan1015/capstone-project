-- Home Appliance Comparison and Buying Guide Platform
-- Database Schema
-- Created: 2024

CREATE DATABASE IF NOT EXISTS home_appliance_db;
USE home_appliance_db;

SET FOREIGN_KEY_CHECKS = 0;

-- users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(15),
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- categories
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- products
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category_id INT NOT NULL,
  model_number VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percentage INT DEFAULT 0,
  image_url VARCHAR(500),
  description TEXT,
  capacity VARCHAR(100),
  energy_rating INT DEFAULT 3,
  warranty_years INT DEFAULT 1,
  stock_status ENUM('in_stock','out_of_stock','limited') DEFAULT 'in_stock',
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- product_specifications
CREATE TABLE product_specifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  spec_key VARCHAR(100) NOT NULL,
  spec_value VARCHAR(255) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- product_features
CREATE TABLE product_features (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  feature_type ENUM('feature','pro','con') DEFAULT 'feature',
  feature_text VARCHAR(255) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- reviews
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_review (product_id, user_id)
);

-- wishlist
CREATE TABLE wishlist (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist (user_id, product_id)
);

-- comparisons (session-based, user can store up to 4 items)
CREATE TABLE comparisons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_comparison (user_id, product_id)
);

-- buying_guides
CREATE TABLE buying_guides (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  category_id INT,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  summary TEXT,
  author_id INT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(average_rating);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_comparisons_user ON comparisons(user_id);

SET FOREIGN_KEY_CHECKS = 1;
