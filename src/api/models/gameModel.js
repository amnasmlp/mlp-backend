const db = require('../../config/dbConfig');

const createGame = async (gameData) => {
  const { total_players, created_by } = gameData;
  const result = await db.query(
    `INSERT INTO games 
    (game_id, created_at, total_players, current_players, status, current_round, last_active_time, created_by) 
    VALUES (uuid_generate_v4(), current_timestamp, $1, 0, 'created', 0, current_timestamp, $2) 
    RETURNING *`,
    [total_players, created_by]
  );
  return result.rows[0];
};

module.exports = {
  createGame,
};
