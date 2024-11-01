const express = require('express');
const runValidation = require('../validators');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const { validateCategory } = require('../validators/category');
const { handleCreateCategory, handleGetCategory, handleSingleCategory, handleUpdateCategory } = require('../controllers/categoryController');

let router = express.Router();

// #1 - Store Category
router.post('/', validateCategory, runValidation, isLoggedIn, isAdmin, handleCreateCategory);
// #2 - Get All Category
router.get('/', handleGetCategory);
// #3 - Get Single Category
router.get('/:slug', handleSingleCategory);
// #4 - Update Category
router.put('/:slug', handleUpdateCategory);

module.exports = router;