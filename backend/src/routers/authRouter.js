const express = require('express');
const runValidation = require('../validators');
const { handleLogin, handleLogout } = require('../controllers/authController');
let router = express.Router();

// #1 - Login
router.post('/login', handleLogin);
// #2 - Logout
router.post('/logout', handleLogout);

module.exports = router;