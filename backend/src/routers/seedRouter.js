const express = require('express');
const { seedUser, seedProduct } = require('../controllers/seedController');
const { uploadUserImage } = require('../middleware/uploadFile');
const { isLoggedIn } = require('../middleware/auth');
let router = express.Router();


router.get("/users", uploadUserImage.single("image"), isLoggedIn, seedUser);
router.get("/products", uploadUserImage.single("image"), isLoggedIn, seedProduct);

module.exports = router;