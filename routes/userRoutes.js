const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

//The routes here connect HTTP requests to the user controller functions

router.get('/register', userController.showRegister);
router.post('/register', userController.register);

router.get('/login', userController.showLogin);
router.post('/login', userController.login);

router.get('/logout', userController.logout);

module.exports = router;
