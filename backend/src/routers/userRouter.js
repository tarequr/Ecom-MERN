const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister, activeUserAccount, updateUserById, handleBanUserById, handleUnBanUserById } = require('../controllers/userController');
const uploadUserImage = require('../middleware/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middleware/auth');
let router = express.Router();

// #1 - Process Register
router.post('/process-register', uploadUserImage.single("image"), isLoggedOut, validateUserRegistration, runValidation, processRegister);
// #2 - Process Register
router.post('/active', isLoggedOut, activeUserAccount);
// #3 - Featch All
router.get('/', isLoggedIn, getUsers);
// #4 - Featch One
router.get('/:id', isLoggedIn, isAdmin, getUserById);
// #5 - Delete One
router.delete('/:id', isLoggedIn, deleteUserById);
// #6 - Update One
router.put('/:id', uploadUserImage.single("image"), isLoggedIn, updateUserById);
// #7 - Banned One
router.put('/ban-user/:id', isLoggedIn, isAdmin, handleBanUserById);
// #8 - UnBanned One
router.put('/unban-user/:id', isLoggedIn, isAdmin, handleUnBanUserById);


module.exports = router;