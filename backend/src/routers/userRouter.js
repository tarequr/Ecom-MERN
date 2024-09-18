const express = require('express');
const { getUsers } = require('../controllers/userController');
let router = express.Router();


router.get('/', getUsers);

module.exports = router;