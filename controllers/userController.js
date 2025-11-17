// controllers/userController.js
const bcrypt = require('bcryptjs');
const escapeHtml = require('escape-html');
const User = require('../models/userModel');
const logger = require('../config/logger');

//All functions for export contain try-catch for error handling and logging
//Utilising this pattern to ensure robust error management and secure logging

//All these functions are exported for use in routes

//Exports the function to show the registration form
exports.showRegister = (req, res) => {
  res.render('register', { title: 'Register' });
};

//Exports the function to handle user registration
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    //Password and username validation
    if (!username || !password || username.length < 3 || password.length < 6) {
      return res.status(400).send('Invalid username or password (min length).');
    }
    //Check if username already exists
    const existing = await User.findUserByUsername(username);
    if (existing) {
      return res.status(409).send('Username already taken');
    }

    //bcrypt password hashing using 10 salt rounds
    const hashed = bcrypt.hashSync(password, 10);
    await User.createUser(username, hashed);
    //Log user registration event
    logger.info('User registered', { username });
    res.redirect('/login');
  } catch (err) {
    //Log unexpected registration error
    logger.error(`Register error: ${err.message}`, { error: err.message });
    res.status(500).send('Registration failed');
  }
};

//Exports the function to show the login form
exports.showLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

//Exports the function to handle user login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    //Checks for missing credentials
    if (!username || !password) return res.status(400).send('Missing credentials');

    const user = await User.findUserByUsername(username);
    if (!user) {
      //Log unknown user login attempt
      logger.warn('Login failure - unknown user', { username });
      return res.status(401).send('Invalid username or password');
    }

    //bcrypt password comparison
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      //Log bad password attempt
      logger.warn('Login failure - bad password', { username });
      return res.status(401).send('Invalid username or password');
    }

    req.session.user = { id: user.id, username: escapeHtml(user.username) };
    //Log successful login
    logger.info('User logged in', { username: user.username });
    res.redirect('/students');
  } catch (err) {
    //Log unexpected login error
    logger.error('Login error', { error: err.message });
    res.status(500).send('Login failed');
  }
};

//Exports the function to handle user logout
exports.logout = (req, res) => {
  if (req.session) {
    //Log user logout event
    logger.info('User logged out', { username: req.session.user?.username });
    req.session.destroy(() => res.redirect('/login'));
  } else {
    res.redirect('/login');
  }
};
