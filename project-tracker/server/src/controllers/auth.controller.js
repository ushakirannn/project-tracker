const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');

const generateToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: '7d' });
};

exports.googleCallback = (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${env.clientUrl}/auth/callback?token=${token}`);
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email avatar role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
