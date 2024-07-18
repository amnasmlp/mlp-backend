const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await authService.registerUser(req.body);
    res.status(201).json({ message: 'Confirmation email sent' });
  } catch (error) {
    if (error.code === '23505') {
      if (error.constraint === 'users_username_key') {
        res.status(400).json({ error: 'Username already exists' });
      } else if (error.constraint === 'users_email_key') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(400).json({ error: 'Duplicate key error' });
      }
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = register;

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const { username, token, balance, profile_pic } = await authService.loginUser(email, password);
    res.status(200).json({ username, token, balance, profile_pic });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const activate = async (req, res) => {
  try {
    const user = await authService.activateUser(req.params.token);
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    res.status(200).json({ message: 'Account activated successfully', username: user.username ,token: token, balance :user.balance, profilePic:user.profile_pic });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to activate account' });
  }
};


module.exports = {
  register,
  login,
  activate,
};
