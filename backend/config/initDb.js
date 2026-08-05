const pool = require('./db');

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        target_amount NUMERIC(10,2) NOT NULL,
        current_amount NUMERIC(10,2) DEFAULT 0.00,
        target_date DATE NOT NULL,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        billing_cycle VARCHAR(50) DEFAULT 'monthly',
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        next_billing_date DATE,
        is_auto_detected BOOLEAN DEFAULT true,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Goals and Subscriptions tables verified/created successfully.');
  } catch (err) {
    console.error('Error initializing database tables:', err.message);
  }
};

module.exports = initDb;
