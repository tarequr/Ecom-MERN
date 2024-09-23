const express = require('express');
const { getUsers, getUser } = require('../controllers/userController');
let router = express.Router();

// #1 - Featch All
router.get('/', getUsers);
// #2 - Featch One
router.get('/:id', getUser);

module.exports = router;