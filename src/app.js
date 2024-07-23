const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./api/routes/authRoutes');
const phoneRoutes = require('./api/routes/phoneRoutes');
const gameRoutes = require('./api/routes/gameRoutes');
const errorHandler = require('./middleware/errorHandler');
const corsConfig = require('./config/corsConfig');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const gameSocket = require('./sockets/gameSocket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(corsConfig);
app.use(helmet());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/mobile/', phoneRoutes);
app.use('/api/games', gameRoutes);
app.use(errorHandler);

gameSocket(io);

module.exports = { app, server };
