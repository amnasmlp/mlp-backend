const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./api/routes/authRoutes');
const phoneRountes = require('./api/routes/phoneRoutes');
const errorHandler = require('./middleware/errorHandler');
const corsConfig = require('./config/corsConfig');
const helmet = require('helmet');
const app = express();

app.use(corsConfig)
app.use(helmet())
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/mobile/', phoneRountes);

app.use(errorHandler);

module.exports = app;
