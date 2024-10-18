const express = require('express');
const { seedUser } = require('../controllers/seedController');
const uploadUserImage = require('../middleware/uploadFile');
const { isLoggedIn } = require('../middleware/auth');
let router = express.Router();


router.get("/users", uploadUserImage.single("image"), isLoggedIn, seedUser);

module.exports = router;