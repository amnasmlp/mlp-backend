const db = require('../../config/dbConfig');

const saveVerificationCode = async (userId, code) => {
  const result = await db.query(
    'INSERT INTO verification_codes (user_id, code, created_at) VALUES ($1, $2, current_timestamp) RETURNING *',
    [userId, code]
  );
  return result.rows[0];
};

const getVerificationCode = async (userId) => {
  const result = await db.query(
    'SELECT * FROM verification_codes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
    [userId]
  );
  return result.rows[0];
};

const deleteVerificationCode = async (userId) => {
  await db.query('DELETE FROM verification_codes WHERE user_id = $1', [userId]);
};

module.exports = {
  saveVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
};
