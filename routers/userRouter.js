const express = require('express');
const router = express.Router();
const userActions = require('../actions/userActions');

// Route for getting all users
router.get('/', userActions.getUsers);

// Route for registering a new user
router.post('/register', userActions.registerUser);

// Route for logging in a user
router.post('/login', userActions.loginUser);

module.exports = router;
