const db = require('../../config/dbConfig');

const createUser = async (userData) => {
  const { username, email, password_hash, balance } = userData;
  const result = await db.query(
    `INSERT INTO users 
    (user_id, username, email, password_hash, balance, created_at, updated_at , is_active) 
    VALUES (uuid_generate_v4(), $1, $2, $3, $4, current_timestamp, current_timestamp, FALSE) 
    RETURNING *`,
    [username, email, password_hash, balance]
  );
  return result.rows[0];
};


const getUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};


const activateUser = async (userId) => {
  const result = await db.query(
    'UPDATE users SET is_active = TRUE WHERE user_id = $1 RETURNING *',
    [userId]
  );
  return result.rows[0];
};


const updatePhoneNumber = async (userId, phoneNumber) => {
  const result = await db.query(
    'UPDATE users SET phone_number = $1 WHERE user_id = $2 RETURNING *',
    [phoneNumber, userId]
  );
  return result.rows[0];
};


const getUserById = async (userId) => {
  const result = await db.query('SELECT * FROM users WHERE user_id = $1', [userId]);
  return result.rows[0];
};

const verifyPhoneNumber = async (userId) => {
  const result = await db.query(
    'UPDATE users SET is_phone_verified = TRUE WHERE user_id = $1 RETURNING *',
    [userId]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
  activateUser,
  updatePhoneNumber,
  verifyPhoneNumber,
  getUserById,
};
