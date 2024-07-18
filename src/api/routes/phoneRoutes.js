const express = require('express');
const { body } = require('express-validator');
const phoneController = require('../controllers/phoneController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/add-phone',
  authMiddleware,
  [body('phoneNumber').isMobilePhone()],
  phoneController.addPhoneNumber
);

router.post(
  '/verify-phone',
  authMiddleware,
  [body('code').isLength({ min: 4, max: 6 })],
  phoneController.verifyPhoneNumber
);

module.exports = router;
