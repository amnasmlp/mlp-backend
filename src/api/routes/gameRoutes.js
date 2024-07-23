const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const gameController = require('../controllers/gameController');

router.post('/create', authMiddleware, gameController.createGame);

module.exports = router;
