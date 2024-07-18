// src/api/services/authService.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const activationTokenModel = require('../models/activationTokenModel');
const emailService = require('./emailService');

const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = { ...userData, password_hash: hashedPassword };
  const user = await userModel.createUser(newUser);
  
  const activationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token valid for 24 hours
  await activationTokenModel.createToken(user.user_id, activationToken, expiresAt);
  
  // Send activation email
  await emailService.sendActivationEmail(user.email, user.username,  activationToken);
  
  return user;
};

const loginUser = async (email, password) => {
  const user = await userModel.getUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error('Invalid email or password');
  }

  if (!user.is_active) {
    throw new Error('Please activate your account');
  }

  const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

  return {
    username: user.username,
    token: token,
    balance: user.balance, 
    profile_pic: user.profile_pic 
  };
};


const activateUser = async (token) => {
  const tokenRecord = await activationTokenModel.getToken(token);
  if (!tokenRecord || tokenRecord.expires_at < new Date()) {
    throw new Error('Invalid or expired activation token');
  }
  const user = await userModel.activateUser(tokenRecord.user_id);
  await activationTokenModel.deleteToken(tokenRecord.token_id);
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  activateUser,
};
