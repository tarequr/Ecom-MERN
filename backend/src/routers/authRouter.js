const express = require('express');
const runValidation = require('../validators');
const { handleLogin, handleLogout, handleRefreshToken } = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middleware/auth');
const { validateUserLogin } = require('../validators/auth');
let router = express.Router();

// #1 - Login
router.post('/login', validateUserLogin, runValidation, isLoggedOut, handleLogin);
// #2 - Logout
router.post('/logout', isLoggedIn, handleLogout);
// #3 - Refresh Token
router.get('/refresh-token', handleRefreshToken);

module.exports = router;