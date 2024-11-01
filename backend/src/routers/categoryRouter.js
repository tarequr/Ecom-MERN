const express = require('express');
const runValidation = require('../validators');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const { validateCategory } = require('../validators/category');
const { handleCreateCategory, handleGetCategory, handleSingleCategory, handleUpdateCategory, handleDeleteCategory } = require('../controllers/categoryController');

let router = express.Router();

// #1 - Store Category
router.post('/', validateCategory, runValidation, isLoggedIn, isAdmin, handleCreateCategory);
// #2 - Get All Category
router.get('/', handleGetCategory);
// #3 - Get Single Category
router.get('/:slug', handleSingleCategory);
// #4 - Update Category
router.put('/:slug', validateCategory, runValidation, isLoggedIn, isAdmin, handleUpdateCategory);
// #5 - Delete Category
router.delete('/:slug', isLoggedIn, isAdmin, handleDeleteCategory);

module.exports = router;