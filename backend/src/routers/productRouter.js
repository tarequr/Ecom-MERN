const express = require('express');
const uploadUserImage = require('../middleware/uploadFile');
const runValidation = require('../validators');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const { handleCreateProduct } = require('../controllers/productController');
let router = express.Router();

// #1 - Store Product
router.post('/', uploadUserImage.single("image"), isLoggedIn, isAdmin, handleCreateProduct);

module.exports = router;