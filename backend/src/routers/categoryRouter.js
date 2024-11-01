const express = require('express');
const runValidation = require('../validators');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const { validateCategory } = require('../validators/category');
const { handleCreateCategory } = require('../controllers/categoryController');

let router = express.Router();

// #1 - Category Store
router.post('/', validateCategory, runValidation, isLoggedIn, isAdmin, handleCreateCategory);

module.exports = router;