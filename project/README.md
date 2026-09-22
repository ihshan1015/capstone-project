# 🏠 Home Appliance Comparison and Buying Guide Platform

## Project Description
The Home Appliance Comparison and Buying Guide Platform is a comprehensive web application designed to help users make informed decisions when purchasing home appliances. It provides extensive product catalogs, advanced filtering, side-by-side comparisons, detailed buying guides, and a smart recommendation engine to find the best appliance for specific needs and budgets.

## ✨ Features
- Browse 9 categories of home appliances
- Search by name, brand, model, category
- Advanced filtering (price, brand, energy rating, rating, capacity, warranty)
- Sorting (price, rating, newest, popularity)
- Side-by-side product comparison (up to 4 products, same category)
- Wishlist (authenticated users)
- Product reviews and ratings (authenticated users)
- Rule-based recommendation engine
- Comprehensive buying guides
- Admin dashboard (full CRUD for products, categories, users, reviews, guides)
- JWT authentication with role-based access (user/admin)
- Responsive design

## 🛠️ Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Axios, React Icons, React Toastify |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JWT + bcryptjs |
| Testing | Jest + Supertest |

## 🏗️ System Architecture
```
Frontend (React/Vite :5173)
      |
      | HTTP/REST API
      |
Backend (Node.js/Express :5000)
      |
      | mysql2
      |
MySQL Database (port 3306)
```

## 📁 Folder Structure
```
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── CompareBar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── RecommendationsPage.jsx
│   │   │   ├── GuidesPage.jsx
│   │   │   ├── GuideDetailPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProductsPage.jsx
│   │   │       ├── AdminCategoriesPage.jsx
│   │   │       ├── AdminUsersPage.jsx
│   │   │       ├── AdminReviewsPage.jsx
│   │   │       └── AdminGuidesPage.jsx
│   │   ├── services/
│   │   ├── context/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/
│   ├── config/db.js
│   ├── controllers/ (9 controllers)
│   ├── middleware/ (auth.js, validate.js)
│   ├── routes/ (9 route files)
│   ├── utils/helpers.js
│   ├── tests/api.test.js
│   ├── server.js
│   ├── app.js
│   ├── .env.example
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

## 🗄️ Database Setup

Step 1: Start MySQL and run:
```sql
mysql -u root -p < database/schema.sql
```

Step 2: Load seed data:
```sql
mysql -u root -p < database/seed.sql
```

Or using MySQL client:
```sql
mysql> source /path/to/database/schema.sql;
mysql> source /path/to/database/seed.sql;
```

## ⚙️ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
# Then edit .env with your MySQL credentials

# Start development server
npm run dev

# Backend runs on http://localhost:5000
```

### Environment Variables (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=home_appliance_db
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

## 🎨 Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

## 🚀 How to Run (Complete Steps)

```bash
# 1. Clone / navigate to project
cd project

# 2. Set up MySQL database
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql

# 3. Set up backend
cd backend
npm install
copy .env.example .env
# Edit .env with your DB credentials
npm run dev

# 4. In a new terminal, set up frontend
cd frontend
npm install
npm run dev

# 5. Open browser at http://localhost:5173
```

## 🔑 Default Login Credentials

### Admin Account
| Field | Value |
|-------|-------|
| Email | admin@homeappliance.com |
| Password | Admin@123 |
| Role | admin |

### Test User Accounts
| Email | Password | Role |
|-------|----------|------|
| rahul@example.com | User@123 | user |
| priya@example.com | User@123 | user |
| amit@example.com | User@123 | user |

## 📡 API Documentation

### Authentication APIs
Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | None | Register new user |
| POST | /auth/login | None | Login and get JWT token |
| GET | /auth/profile | Bearer Token | Get current user profile |
| PUT | /auth/profile | Bearer Token | Update profile |

**POST /auth/register**
Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "Password@123"
}
```
Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { "id": 5, "name": "John Doe", "email": "john@example.com" }
}
```

**POST /auth/login**
Request:
```json
{ "email": "admin@homeappliance.com", "password": "Admin@123" }
```
Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": 1, "name": "Admin User", "email": "admin@homeappliance.com", "role": "admin" }
  }
}
```

### Product APIs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /products | None | Get all products (with filters) |
| GET | /products/featured | None | Get featured products |
| GET | /products/popular | None | Get popular products |
| GET | /products/budget | None | Get budget products (<₹20,000) |
| GET | /products/best-rated | None | Get top-rated products |
| GET | /products/:id | None | Get product by ID |
| POST | /products | Admin | Create product |
| PUT | /products/:id | Admin | Update product |
| DELETE | /products/:id | Admin | Delete product |

**GET /products Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search in name, brand, model |
| category | number | Category ID |
| brand | string | Brand name |
| minPrice | number | Minimum price (₹) |
| maxPrice | number | Maximum price (₹) |
| energyRating | number | Minimum energy stars (1-5) |
| rating | number | Minimum average rating |
| sort | string | price_asc, price_desc, rating, newest, popularity |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 12) |

### Category APIs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /categories | None | Get all categories |
| GET | /categories/:id | None | Get single category |
| POST | /categories | Admin | Create category |
| PUT | /categories/:id | Admin | Update category |
| DELETE | /categories/:id | Admin | Delete category |

### Review APIs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /products/:id/reviews | None | Get reviews for product |
| POST | /products/:id/reviews | User | Create review |
| PUT | /reviews/:id | User (own) | Update review |
| DELETE | /reviews/:id | User (own) or Admin | Delete review |

**POST /products/:id/reviews**
Request:
```json
{
  "rating": 5,
  "title": "Excellent product",
  "review_text": "Very happy with my purchase. Works great!"
}
```

### Wishlist APIs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /wishlist | User | Get user wishlist |
| POST | /wishlist | User | Add product to wishlist |
| DELETE | /wishlist/:productId | User | Remove from wishlist |

### Comparison APIs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /compare | User | Get compare list |
| POST | /compare | User | Add product to compare |
| DELETE | /compare/clear | User | Clear all comparisons |
| DELETE | /compare/:productId | User | Remove product from compare |

**POST /compare** Request: `{ "productId": 1 }`

### Recommendation API
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /recommendations | None | Get recommendations |

Request:
```json
{
  "categoryId": 1,
  "budget": 30000,
  "capacity": "250L",
  "brand": "Samsung",
  "minRating": 4,
  "energyRating": 3,
  "features": ["Inverter", "Frost Free"]
}
```

Response returns products sorted by match score with matchingReasons array.

### Buying Guides APIs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /guides | None | Get all guides |
| GET | /guides/:id | None | Get guide by ID or slug |
| POST | /guides | Admin | Create guide |
| PUT | /guides/:id | Admin | Update guide |
| DELETE | /guides/:id | Admin | Delete guide |

### Admin APIs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /admin/dashboard | Admin | Dashboard statistics |
| GET | /admin/users | Admin | List all users |
| PUT | /admin/users/:id | Admin | Update user status/role |
| GET | /admin/reviews | Admin | List all reviews |
| DELETE | /admin/reviews/:id | Admin | Delete review |

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds=10
- **JWT Authentication**: Stateless tokens with 7-day expiry
- **Role-Based Authorization**: User and Admin roles
- **Input Validation**: express-validator on all inputs
- **SQL Injection Prevention**: Parameterized queries with mysql2
- **CORS**: Configured for frontend origin only
- **Environment Variables**: All secrets in .env (never committed)

## 🧪 Running Tests

```bash
cd backend
npm test
```

> **Note**: Tests require a running MySQL database with seed data loaded.

## 🗺️ Frontend Routes

| Route | Page | Auth Required |
|-------|------|---------------|
| / | Home Page | No |
| /login | Login | No |
| /register | Register | No |
| /products | Products List | No |
| /products/:id | Product Detail | No |
| /compare | Compare Products | No |
| /recommendations | Get Recommendations | No |
| /guides | Buying Guides | No |
| /guides/:id | Guide Detail | No |
| /wishlist | My Wishlist | Yes (user) |
| /profile | My Profile | Yes (user) |
| /admin | Admin Dashboard | Yes (admin) |
| /admin/products | Manage Products | Yes (admin) |
| /admin/categories | Manage Categories | Yes (admin) |
| /admin/users | Manage Users | Yes (admin) |
| /admin/reviews | Manage Reviews | Yes (admin) |
| /admin/guides | Manage Guides | Yes (admin) |

## 🎯 Recommendation Algorithm

The recommendation engine uses a rule-based scoring system:

| Criteria | Points | Condition |
|----------|--------|-----------|
| Budget match | 30 | Price ≤ budget |
| Budget near | 15 | Price ≤ budget × 1.10 |
| Brand match | 15 | Exact brand name match |
| Rating match | 20 | average_rating ≥ minRating |
| High rated bonus | 10 | Rating ≥ 4 (if no minRating specified) |
| Energy rating | 15 | energy_rating ≥ required |
| Capacity match | 10 | Capacity string match |
| Feature match | 5 per | Per matched feature (max 10) |

Products are sorted by score descending, top 8 returned.

## 🛍️ Sample Data

The seed data includes:
- **25 products** across 5 categories (5 each: Refrigerators, Washing Machines, ACs, TVs, Microwaves)
- **9 categories** (Refrigerator, Washing Machine, AC, TV, Microwave, Air Cooler, Dishwasher, Water Purifier, Vacuum Cleaner)
- **4 users** (1 admin, 3 regular users)
- **3 buying guides** (Refrigerator, Washing Machine, AC)
- **Sample reviews** for testing ratings
- All prices in Indian Rupees (₹)

## 🔮 Future Enhancements

1. Product image upload (currently uses URL)
2. Advanced AI-based recommendation engine
3. Price comparison with e-commerce sites
4. Email notifications for price drops
5. Social login (Google, Facebook)
6. Product availability alerts
7. Mobile app (React Native)
8. Multi-language support

## 📸 Screenshots

*(Screenshots would be added after deployment)*

---

**Developed as a Capstone Project** | Home Appliance Comparison and Buying Guide Platform
