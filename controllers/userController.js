// controllers/userController.js
const bcrypt = require('bcryptjs');
const escapeHtml = require('escape-html');
const User = require('../models/userModel');
const logger = require('../config/logger');

exports.showRegister = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || username.length < 3 || password.length < 6) {
      return res.status(400).send('Invalid username or password (min length).');
    }

    const existing = await User.findUserByUsername(username);
    if (existing) {
      return res.status(409).send('Username already taken');
    }

    const hashed = bcrypt.hashSync(password, 10);
    await User.createUser(username, hashed);
    logger.info('User registered', { username });
    res.redirect('/login');
  } catch (err) {
    logger.error(`Register error: ${err.message}`, { error: err.message });
    res.status(500).send('Registration failed');
  }
};

exports.showLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Missing credentials');

    const user = await User.findUserByUsername(username);
    if (!user) {
      logger.warn('Login failure - unknown user', { username });
      return res.status(401).send('Invalid username or password');
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      logger.warn('Login failure - bad password', { username });
      return res.status(401).send('Invalid username or password');
    }

  
    req.session.user = { id: user.id, username: escapeHtml(user.username) };
    logger.info('User logged in', { username: user.username });
    res.redirect('/students');
  } catch (err) {
    logger.error('Login error', { error: err.message });
    res.status(500).send('Login failed');
  }
};

exports.logout = (req, res) => {
  if (req.session) {
    logger.info('User logged out', { username: req.session.user?.username });
    req.session.destroy(() => res.redirect('/login'));
  } else {
    res.redirect('/login');
  }
};
