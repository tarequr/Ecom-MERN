const express = require('express');
const runValidation = require('../validators');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middleware/auth');

let router = express.Router();

// #1 - Category Store
router.post('/', handleCreateCategory);

module.exports = router;