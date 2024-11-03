const express = require('express');
const { uploadProductImage } = require('../middleware/uploadFile');
const runValidation = require('../validators');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const { handleCreateProduct } = require('../controllers/productController');
const { validateProduct } = require('../validators/product');
let router = express.Router();

// #1 - Store Product
router.post('/', uploadProductImage.single("image"), validateProduct, runValidation, isLoggedIn, isAdmin, handleCreateProduct);

module.exports = router;