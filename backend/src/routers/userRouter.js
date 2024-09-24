const express = require('express');
const { getUsers, getUserById, deleteUserById } = require('../controllers/userController');
let router = express.Router();

// #1 - Featch All
router.get('/', getUsers);
// #2 - Featch One
router.get('/:id', getUserById);
// #3 - Delete One
router.delete('/:id', deleteUserById);

module.exports = router;