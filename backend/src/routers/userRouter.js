const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister, activeUserAccount, updateUserById, handleManageUserStatusById, handleUpdatePassword } = require('../controllers/userController');
const uploadUserImage = require('../middleware/uploadFile');
const { validateUserRegistration, validateUserPasswordUpdate } = require('../validators/auth');
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
// #7 - Update Password
router.put('/update-password/:id', validateUserPasswordUpdate, runValidation, isLoggedIn, handleUpdatePassword);


module.exports = router;