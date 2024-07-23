const gameModel = require('../models/gameModel');

const createGame = async (gameData) => {
  try {
    const newGame = await gameModel.createGame(gameData);
    return newGame;
  } catch (error) {
    console.error('Error creating game:', error);
    throw new Error('Failed to create game');
  }
};

module.exports = {
  createGame,
};
