const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');

describe('Transaction routes', () => {
  const testUser = {
    name: 'Transaction Tester',
    email: `txtest_${Date.now()}@example.com`,
    password: 'testpassword123',
  };

  let token;
  let createdTransactionId;

  // runs once before all tests in this file — sign up and log in to get a real token
  beforeAll(async () => {
    await request(app).post('/api/auth/signup').send(testUser);
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    await pool.end();
  });

  test('POST /api/transactions rejects request with no token', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({ amount: 100, description: 'No auth test', category_id: 1 });

    expect(res.statusCode).toBe(401);
  });

  test('POST /api/transactions creates a transaction with valid token', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 250, description: 'Test lunch', category_id: 1 });

    expect(res.statusCode).toBe(201);
    expect(res.body.transaction).toHaveProperty('id');
    expect(res.body.transaction.amount).toBe('250.00');

    createdTransactionId = res.body.transaction.id; // save for later tests
  });

  test('POST /api/transactions rejects invalid amount (validation)', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 'not-a-number', description: 'Bad data test', category_id: 1 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  test('GET /api/transactions returns the created transaction', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.transactions.length).toBeGreaterThan(0);
    const found = res.body.transactions.find(t => t.id === createdTransactionId);
    expect(found).toBeDefined();
    expect(found.description).toBe('Test lunch');
  });

  test('PUT /api/transactions/:id updates the transaction', async () => {
    const res = await request(app)
      .put(`/api/transactions/${createdTransactionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 300 });

    expect(res.statusCode).toBe(200);
    expect(res.body.transaction.amount).toBe('300.00');
  });

  test('DELETE /api/transactions/:id deletes the transaction', async () => {
    const res = await request(app)
      .delete(`/api/transactions/${createdTransactionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Transaction deleted');
  });

  test('GET /api/transactions/:id no longer includes deleted transaction', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);

    const found = res.body.transactions.find(t => t.id === createdTransactionId);
    expect(found).toBeUndefined();
  });
});