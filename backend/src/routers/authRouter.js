const express = require('express');
const runValidation = require('../validators');
const { handleLogin } = require('../controllers/authController');
let router = express.Router();

// #1 - Login
router.post('/login', handleLogin);

module.exports = router;