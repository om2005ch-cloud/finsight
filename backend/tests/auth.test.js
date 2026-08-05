const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');

describe('Auth routes', () => {
  const testUser = {
    name: 'Test User',
    email: `testuser_${Date.now()}@example.com`, // unique email each run
    password: 'testpassword123',
  };

  afterAll(async () => {
    // clean up the test user we created, then close the DB connection
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    await pool.end();
  });

  test('POST /api/auth/signup creates a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user).not.toHaveProperty('password'); // password should never be returned
  });

  test('POST /api/auth/signup rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser); // same email as before

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe('User already exists');
  });

  test('POST /api/auth/login succeeds with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
  });

  test('POST /api/auth/login rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });
});