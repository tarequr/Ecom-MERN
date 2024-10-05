const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister, activeUserAccount, updateUserById } = require('../controllers/userController');
const upload = require('../middleware/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
let router = express.Router();

// #1 - Process Register
router.post('/process-register', upload.single("image"), validateUserRegistration, runValidation, processRegister);
// #2 - Process Register
router.post('/verify', activeUserAccount);
// #3 - Featch All
router.get('/', getUsers);
// #4 - Featch One
router.get('/:id', getUserById);
// #5 - Delete One
router.delete('/:id', deleteUserById);
// #5 - Delete One
router.put('/:id', updateUserById);

module.exports = router;