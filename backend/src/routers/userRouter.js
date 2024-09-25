const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister } = require('../controllers/userController');
let router = express.Router();

// #1 - Process Register
router.post('/process-register', processRegister);
// #2 - Featch All
router.get('/', getUsers);
// #3 - Featch One
router.get('/:id', getUserById);
// #4 - Delete One
router.delete('/:id', deleteUserById);

module.exports = router;