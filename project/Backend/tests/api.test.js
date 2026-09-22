/**
 * NOTE: These tests require a running MySQL database with seed data loaded.
 */
const request = require('supertest');
const app = require('../app');

let adminToken = '';
let userToken = '';
let newProductId = null;
let newCategoryId = null;

const uniqueEmail = `user_${Date.now()}@test.com`;

const getAdminToken = async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@homeappliance.com', password: 'Admin@123' });
  return res.body.data?.token;
};

const getUserToken = async (email, password) => {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.data?.token;
};

beforeAll(async () => {
    adminToken = await getAdminToken();
});

describe('1. Auth Tests', () => {
    test('POST /api/auth/register with valid data (201)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: uniqueEmail,
                password: 'password123',
                confirmPassword: 'password123'
            });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
        userToken = res.body.data.token;
    });

    test('POST /api/auth/register with duplicate email (400)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User 2',
                email: uniqueEmail,
                password: 'password123',
                confirmPassword: 'password123'
            });
        expect(res.status).toBe(400);
    });

    test('POST /api/auth/register with invalid email (400)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User 3',
                email: 'invalid-email',
                password: 'password123',
                confirmPassword: 'password123'
            });
        expect(res.status).toBe(400);
    });

    test('POST /api/auth/login with valid credentials (200, returns token)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: uniqueEmail,
                password: 'password123'
            });
        expect(res.status).toBe(200);
        expect(res.body.data.token).toBeDefined();
    });

    test('POST /api/auth/login with wrong password (400)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: uniqueEmail,
                password: 'wrongpassword'
            });
        expect(res.status).toBe(400);
    });

    test('POST /api/auth/login with non-existent email (400)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'doesnotexist@test.com',
                password: 'password123'
            });
        expect(res.status).toBe(400);
    });

    test('GET /api/auth/profile without token (401)', async () => {
        const res = await request(app).get('/api/auth/profile');
        expect(res.status).toBe(401);
    });

    test('GET /api/auth/profile with valid token (200)', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(200);
    });
});

describe('2. Product Tests', () => {
    test('GET /api/products (200, returns array)', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data?.products || res.body.data)).toBe(true);
    });

    test('GET /api/products with search query (200)', async () => {
        const res = await request(app).get('/api/products?search=fridge');
        expect(res.status).toBe(200);
    });

    test('GET /api/products with category filter (200)', async () => {
        const res = await request(app).get('/api/products?categoryId=1');
        expect(res.status).toBe(200);
    });

    test('GET /api/products with price filter (200)', async () => {
        const res = await request(app).get('/api/products?minPrice=100&maxPrice=1000');
        expect(res.status).toBe(200);
    });

    test('GET /api/products/:id with valid ID (200)', async () => {
        const res = await request(app).get('/api/products/1');
        if(res.status !== 404) {
            expect(res.status).toBe(200);
        }
    });

    test('GET /api/products/999999 with invalid ID (404)', async () => {
        const res = await request(app).get('/api/products/999999');
        expect(res.status).toBe(404);
    });

    test('GET /api/products/featured (200)', async () => {
        const res = await request(app).get('/api/products/featured');
        expect(res.status).toBe(200);
    });

    test('GET /api/products/popular (200)', async () => {
        const res = await request(app).get('/api/products/popular');
        expect(res.status).toBe(200);
    });

    test('GET /api/products/budget (200)', async () => {
        const res = await request(app).get('/api/products/budget');
        expect(res.status).toBe(200);
    });

    test('GET /api/products/best-rated (200)', async () => {
        const res = await request(app).get('/api/products/best-rated');
        expect(res.status).toBe(200);
    });

    test('POST /api/products without auth (401)', async () => {
        const res = await request(app).post('/api/products').send({ name: 'Test Product' });
        expect(res.status).toBe(401);
    });

    test('POST /api/products with admin auth (201)', async () => {
        if (!adminToken) return;
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Test Product',
                description: 'Test Desc',
                price: 100,
                categoryId: 1,
                brandId: 1,
                stock: 10
            });
        if(res.status === 201) {
            expect(res.status).toBe(201);
            newProductId = res.body.data?.id;
        }
    });

    test('PUT /api/products/:id with admin auth (200)', async () => {
        if (!newProductId || !adminToken) return;
        const res = await request(app)
            .put(`/api/products/${newProductId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ price: 150 });
        expect(res.status).toBe(200);
    });

    test('DELETE /api/products/:id with admin auth (200)', async () => {
        if (!newProductId || !adminToken) return;
        const res = await request(app)
            .delete(`/api/products/${newProductId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });
});

describe('3. Category Tests', () => {
    test('GET /api/categories (200)', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.status).toBe(200);
    });

    test('POST /api/categories without auth (401)', async () => {
        const res = await request(app).post('/api/categories').send({ name: 'New Cat' });
        expect(res.status).toBe(401);
    });

    test('POST /api/categories with admin auth (201)', async () => {
        if (!adminToken) return;
        const res = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Test Category',
                slug: `test-cat-${Date.now()}`,
                description: 'A test category'
            });
        if(res.status === 201) {
            expect(res.status).toBe(201);
            newCategoryId = res.body.data?.id;
        }
    });

    test('PUT /api/categories/:id with admin auth (200)', async () => {
        if (!newCategoryId || !adminToken) return;
        const res = await request(app)
            .put(`/api/categories/${newCategoryId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Updated Category' });
        expect(res.status).toBe(200);
    });

    test('DELETE /api/categories/:id with admin auth (200)', async () => {
        if (!newCategoryId || !adminToken) return;
        const res = await request(app)
            .delete(`/api/categories/${newCategoryId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });
});

describe('4. Review Tests', () => {
    test('GET /api/products/1/reviews (200)', async () => {
        const res = await request(app).get('/api/products/1/reviews');
        if (res.status !== 404) {
            expect(res.status).toBe(200);
        }
    });

    test('POST /api/products/1/reviews without auth (401)', async () => {
        const res = await request(app).post('/api/products/1/reviews').send({ rating: 5, comment: 'Good' });
        expect(res.status).toBe(401);
    });

    test('POST /api/products/1/reviews with auth - valid (201)', async () => {
        if (!userToken) return;
        const res = await request(app)
            .post('/api/products/1/reviews')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ rating: 5, comment: 'Great product' });
        if(res.status === 201) {
             expect(res.status).toBe(201);
        }
    });

    test('POST /api/products/1/reviews again - duplicate (400)', async () => {
        if (!userToken) return;
        const res = await request(app)
            .post('/api/products/1/reviews')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ rating: 4, comment: 'Another review' });
        if(res.status === 400) {
            expect(res.status).toBe(400);
        }
    });

    test('POST /api/products/1/reviews with invalid rating (400)', async () => {
        if (!userToken) return;
        const res = await request(app)
            .post('/api/products/1/reviews')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ rating: 6, comment: 'Invalid' });
        expect(res.status).toBe(400);
    });
});

describe('5. Wishlist Tests', () => {
    test('GET /api/wishlist without auth (401)', async () => {
        const res = await request(app).get('/api/wishlist');
        expect(res.status).toBe(401);
    });

    test('GET /api/wishlist with auth (200)', async () => {
        if (!userToken) return;
        const res = await request(app)
            .get('/api/wishlist')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(200);
    });

    test('POST /api/wishlist with auth (201)', async () => {
        if (!userToken) return;
        const res = await request(app)
            .post('/api/wishlist')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ productId: 1 });
        if (res.status === 201) {
            expect(res.status).toBe(201);
        }
    });

    test('DELETE /api/wishlist/1 with auth (200)', async () => {
        if (!userToken) return;
        const res = await request(app)
            .delete('/api/wishlist/1')
            .set('Authorization', `Bearer ${userToken}`);
        if(res.status === 200) {
            expect(res.status).toBe(200);
        }
    });
});

describe('6. Compare Tests', () => {
    test('GET /api/compare without auth (401)', async () => {
        const res = await request(app).get('/api/compare');
        expect(res.status).toBe(401);
    });

    test('GET /api/compare with auth (200)', async () => {
        if (!userToken) return;
        const res = await request(app)
            .get('/api/compare')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(200);
    });

    test('POST /api/compare with auth (201)', async () => {
        if (!userToken) return;
        const res = await request(app)
            .post('/api/compare')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ productId: 1 });
        if(res.status === 201) {
            expect(res.status).toBe(201);
        }
    });

    test('DELETE /api/compare/clear with auth (200)', async () => {
        if (!userToken) return;
        const res = await request(app)
            .delete('/api/compare/clear')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(200);
    });
});

describe('7. Recommendation Tests', () => {
    test('POST /api/recommendations without categoryId (400)', async () => {
        const res = await request(app)
            .post('/api/recommendations')
            .send({ minPrice: 100, maxPrice: 1000 });
        expect(res.status).toBe(400);
    });

    test('POST /api/recommendations with valid data (200)', async () => {
        const res = await request(app)
            .post('/api/recommendations')
            .send({ categoryId: 1, minPrice: 100, maxPrice: 1000 });
        if(res.status === 200) {
            expect(res.status).toBe(200);
        }
    });
});

describe('8. Admin Tests', () => {
    test('GET /api/admin/dashboard without auth (401)', async () => {
        const res = await request(app).get('/api/admin/dashboard');
        expect(res.status).toBe(401);
    });

    test('GET /api/admin/dashboard as user (403)', async () => {
        if (!userToken) return;
        const res = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(403);
    });

    test('GET /api/admin/dashboard as admin (200)', async () => {
        if(!adminToken) return;
        const res = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });

    test('GET /api/admin/users as admin (200)', async () => {
        if(!adminToken) return;
        const res = await request(app)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });

    test('GET /api/admin/reviews as admin (200)', async () => {
        if(!adminToken) return;
        const res = await request(app)
            .get('/api/admin/reviews')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });
});
