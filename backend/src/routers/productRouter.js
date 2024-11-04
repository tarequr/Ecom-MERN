const express = require('express');
const { uploadProductImage } = require('../middleware/uploadFile');
const runValidation = require('../validators');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const { handleCreateProduct, handleGetProduct, handleSingleProduct, handleDeleteProduct } = require('../controllers/productController');
const { validateProduct } = require('../validators/product');
let router = express.Router();

// #1 - Store Product
router.post('/', uploadProductImage.single("image"), validateProduct, runValidation, isLoggedIn, isAdmin, handleCreateProduct);
// #2 - Get All Product
router.get('/', handleGetProduct);
// #3 - Get Single Product
router.get('/:slug', handleSingleProduct);
// // #4 - Update Product
// router.put('/:slug', validateCategory, runValidation, isLoggedIn, isAdmin, handleUpdateProduct);
// #5 - Delete Product
router.delete('/:slug', isLoggedIn, isAdmin, handleDeleteProduct);

module.exports = router;