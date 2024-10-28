const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister, activeUserAccount, updateUserById, handleManageUserStatusById, handleUpdatePassword, handleForgetPassword, userResetPassword } = require('../controllers/userController');
const uploadUserImage = require('../middleware/uploadFile');
const { validateUserRegistration, validateUserPasswordUpdate, validateUserForgetPassword, validateUserResetPassword } = require('../validators/auth');
const runValidation = require('../validators');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middleware/auth');
let router = express.Router();

// #1 - Process Register
router.post('/process-register', uploadUserImage.single("image"), isLoggedOut, validateUserRegistration, runValidation, processRegister);
// #2 - Process Register
router.post('/active', isLoggedOut, activeUserAccount);
// #3 - Reset Password
router.put('/reset-password', validateUserResetPassword, runValidation, userResetPassword);
// #4 - Featch All
router.get('/', isLoggedIn, getUsers);
// #5 - Featch One
router.get('/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, getUserById);
// #6 - Delete One
router.delete('/:id([0-9a-fA-F]{24})', isLoggedIn, deleteUserById);
// #7 - Update One
router.put('/:id([0-9a-fA-F]{24})', uploadUserImage.single("image"), isLoggedIn, updateUserById);
// #8 - Update Password
router.put('/update-password/:id([0-9a-fA-F]{24})', validateUserPasswordUpdate, runValidation, isLoggedIn, handleUpdatePassword);
// #9 - Forget Password
router.post('/forget-password', validateUserForgetPassword, runValidation, handleForgetPassword);


module.exports = router;