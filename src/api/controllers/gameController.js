const gameService = require('../services/gameService');

const createGame = async (req, res) => {
  const { total_players } = req.body;
  const created_by = req.user.id;

  if (!created_by) {
    return res.status(400).json({ error: 'user not found' });
  }

  try {
    const game = await gameService.createGame({ total_players, created_by });
    const gameUrl =  `${process.env.CLIENT_SIDE_URL}game/${game.game_id}`;
    res.status(201).json({ url: gameUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createGame,
};
