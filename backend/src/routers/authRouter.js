const express = require('express');
const runValidation = require('../validators');
const { handleLogin, handleLogout } = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middleware/auth');
let router = express.Router();

// #1 - Login
router.post('/login', isLoggedOut, handleLogin);
// #2 - Logout
router.post('/logout', isLoggedIn, handleLogout);

module.exports = router;