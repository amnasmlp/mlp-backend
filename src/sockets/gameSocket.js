const jwt = require('jsonwebtoken');
const pool = require('../config/dbConfig');

// Middleware to authenticate WebSocket connections
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token provided'));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Invalid token'));

    socket.user = decoded;
    next();
  });
};

// Function to set up the game WebSocket
const setupGameSocket = (io) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.id);

    socket.on('join_game', async (gameId, username) => {
      console.log('Join game event received:', gameId);
      const { user_id } = socket.user;

      try {
        // Check if the game exists
        const gameResult = await pool.query('SELECT * FROM games WHERE game_id = \$1', [gameId]);
        const game = gameResult.rows[0];

        if (!game) {
          socket.emit('game_error', 'Game not found');
          return;
        }

        // Check if the game is full
        if (game.current_players >= 4) {
          socket.emit('game_error', 'Game is full');
          return;
        }

        // Check if the user is already a player in the game
        const playerResult = await pool.query('SELECT * FROM players WHERE user_id = \$1 AND game_id = \$2', [user_id, gameId]);
        const player = playerResult.rows[0];

        if (player) {
          socket.emit('player_info', player);
        } else {
          // Insert a new player
          await pool.query(
            'INSERT INTO players (user_id, game_id, username, available_chips, game_status, status) VALUES (\$1, \$2, \$3, \$4, \$5, \$6)',
            [socket.user.id, gameId, username, 25, 'waiting', 'active']
          );
          // Update the game to reflect the new player count
          await pool.query('UPDATE games SET current_players = current_players + 1 WHERE game_id = \$1', [gameId]);
          socket.emit('seat_assigned', { message: 'Seat assigned', gameId });
        }

        // Fetch and emit information of all players in the game
        const allPlayersResult = await pool.query('SELECT * FROM players WHERE game_id = \$1', [gameId]);
        const allPlayers = allPlayersResult.rows;
        socket.emit('all_players_info', allPlayers);

      } catch (error) {
        console.error('Error:', error);
        socket.emit('game_error', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.user_id);
    });
  });
};

module.exports = setupGameSocket;