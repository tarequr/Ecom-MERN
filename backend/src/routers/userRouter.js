const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister, activeUserAccount } = require('../controllers/userController');
const upload = require('../middleware/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
let router = express.Router();

// #1 - Process Register
router.post('/process-register', validateUserRegistration, runValidation, upload.single("image"), processRegister);
router.post('/verify', activeUserAccount);
// #2 - Featch All
router.get('/', getUsers);
// #3 - Featch One
router.get('/:id', getUserById);
// #4 - Delete One
router.delete('/:id', deleteUserById);

module.exports = router;