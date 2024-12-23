const mongoose = require('mongoose');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;

const User = require('../models/userModel');
const { successResponse } = require('../helpers/responseHandler');
const { findWithId } = require('../services/findItem');
const { deleteImage } = require('../helpers/deleteImage');
const { createJSONWebToken } = require('../helpers/jsonwebtoken');
const { jwtActivationKey, clientURL, jwtResetPasswordKey } = require('../secret');
const emailWithNodeMailer = require('../helpers/email');
const { hadleUserAction, findUsers, findUserById, handleDeleteUserById, handleUpdateUserById, hadleUserPasswordUpdate, hadleUserForgetPasswordByEmail, hadleUserResetPassword } = require('../services/userService');
const { checkUserExists } = require('../helpers/checkUserExists');
const { sendEmail } = require('../helpers/sendEmail');
const cloudinary = require('../config/cloudinary');



const processRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const newUser = {
            name, 
            email, 
            password, 
            phone, 
            address
        }

        // const image = req.file;

        // if (!image) {
        //     throw createError(400, 'Image field is required.')
        // }

        // if (image.size > 1024 * 1024 * 2) {
        //     throw createError(400, 'File size must be between 2 MB')
        // }

        // const imageBufferString = image.buffer.toString('base64');

        // anoher way
        const image = req.file?.path;
        if (image && image.size > 1024 * 1024 * 2) {
            throw createError(400, 'File size must be between 2 MB')
        }

        const userExists = await checkUserExists(email);

        if (userExists) {
            throw createError(409, 'User already exists');
        }

        // , image: imageBufferString
        //create JWT token
        const tokenPayload = { name, email, password, phone, address }
        if (image) {
            tokenPayload.image = image;
        }

        const token = createJSONWebToken(tokenPayload, jwtActivationKey, '10m');

        //prepare email
        const emailData = {
            email: email,
            subject: 'Account Activation Email',
            html: `
                <h2>Hello ${name} ! </h2>
                <p>Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">Activate your account</a></p>
            `,
        }

        sendEmail(emailData);
        
        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for complete verification`,
            payload: { newUser, token }
        });
    } catch (error) {   
        next(error);
    }
}

const activeUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token;

        if (!token) throw createError(404, "Token not found");

        try {
            const decoded = jwt.verify(token, jwtActivationKey);
            if (!decoded) throw createError(401, "Unable to verify user");

            const userExists = await User.exists({ email: decoded.email });

            if (userExists) {
                throw createError(409, 'User already exists. Please sign in');
            }

            const image = decoded.image;

            if (image) {
                const respose = await cloudinary.uploader.upload(image, {
                    folder: "ecommerceMern/users",
                });

                decoded.image = respose.secure_url;
            }

            const user = await User.create(decoded);

            return successResponse(res, {
                statusCode: 201,
                message: "User registered successfully",
                payload: { user }
            });
        } catch (error) {
            if (error.name == "TokenExpiredError") {
                throw createError(401, "Token has expired");
            } else if(error.name == "jsonWebTokenError") {
                throw createError(401, "Invalid JSON Web Token");
            } else {
                throw error;
            }
        }        
    } catch (error) {   
        next(error);
    }
}

const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page   = Number(req.query.page) || 1;
        const limit  = Number(req.query.limit) || 5;

        const { users, count } = await findUsers(search, limit, page);
        
        return successResponse(res, {
            statusCode: 200,
            message: 'Users data fatch successfully',
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
                }
            }
        });
    } catch (error) {
        next(error);
    }
}

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };

        const user = await findUserById(id, options);

        return successResponse(res, {
            statusCode: 200,
            message: 'User data fatch successfully',
            payload: { user }
        });
    } catch (error) {   
        next(error);
    }
}

const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        await handleDeleteUserById(id);

        // const userImagePath = user.image;

        // 1st way
        // fs.access(userImagePath, (err) => {
        //     if (err) {
        //         console.error("User image does not exist!");
        //     } else {
        //         fs.unlink(userImagePath, (err) => {
        //             if (err) throw err;
        //             console.log("User image was deleted!");
        //         });
        //     }
        // }); 

        // 2nd way
        // fs.access(userImagePath)
        //     .then(() => fs.unlink(userImagePath))
        //     .then(() => console.log("User image was deleted!"))
        //     .catch((err) => console.error("User image does not exist!"));

        // 3rd way
        // deleteImage(userImagePath);

        

        return successResponse(res, {
            statusCode: 200,
            message: 'User deleted successfully',
        });
    } catch (error) {   
        next(error);
    }
}

const updateUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const updatedUser = await handleUpdateUserById(userId, req);

        return successResponse(res, {
            statusCode: 200,
            message: 'User updated successfully',
            payload: updatedUser
        });
    } catch (error) {   
        next(error);
    }
}

const handleManageUserStatusById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const action = req.body.action;

        const { successMessage, updatedUser } = await hadleUserAction(userId, action);

        return successResponse(res, {
            statusCode: 200,
            message: successMessage,
            payload: { updatedUser }
        });
    } catch (error) {   
        next(error);
    }
}

const handleUpdatePassword = async (req, res, next) => {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.params.id;

        const updatedUser = await hadleUserPasswordUpdate(email, userId, oldPassword, newPassword, confirmPassword)

        return successResponse(res, {
            statusCode: 200,
            message: 'Password updated successfully',
            payload: { updatedUser }
        });
    } catch (error) {   
        next(error);
    }
}

const handleForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        const token = await hadleUserForgetPasswordByEmail(email);
        
        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for reseting your password`,
            payload: { token }
        });
    } catch (error) {   
        next(error);
    }
}

const userResetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const updatedUser = await hadleUserResetPassword(token, password);
        
        return successResponse(res, {
            statusCode: 200,
            message: 'Password reset successfully',
            payload: { updatedUser }
        });
    } catch (error) {   
        next(error);
    }
}

module.exports = { processRegister, getUsers, getUserById, deleteUserById, activeUserAccount, updateUserById, handleManageUserStatusById, handleUpdatePassword, handleForgetPassword, userResetPassword };