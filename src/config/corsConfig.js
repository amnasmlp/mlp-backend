const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000','https://www.mylittlerivercard.eu','https://www.mylittlerivercard.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
