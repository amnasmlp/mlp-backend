const db = require('../../config/dbConfig');

const createToken = async (userId, token, expiresAt) => {
  const result = await db.query(
    `INSERT INTO activation_tokens (user_id, token, expires_at) 
    VALUES ($1, $2, $3) 
    RETURNING *`,
    [userId, token, expiresAt]
  );
  return result.rows[0];
};

const getToken = async (token) => {
  const result = await db.query('SELECT * FROM activation_tokens WHERE token = $1', [token]);
  return result.rows[0];
};

const deleteToken = async (tokenId) => {
  const result = await db.query('DELETE FROM activation_tokens WHERE token_id = $1', [tokenId]);
  return result.rowCount;
};

module.exports = {
  createToken,
  getToken,
  deleteToken,
};
