const express = require('express');
const { getUsers, getUser, deleteUser } = require('../controllers/userController');
let router = express.Router();

// #1 - Featch All
router.get('/', getUsers);
// #2 - Featch One
router.get('/:id', getUser);
// #3 - Delete One
router.delete('/:id', deleteUser);

module.exports = router;