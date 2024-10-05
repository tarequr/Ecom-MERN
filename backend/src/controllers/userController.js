const mongoose = require('mongoose');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;

const User = require('../models/userModel');
const { successResponse } = require('../helpers/responseHandler');
const { findWithId } = require('../services/findItem');
const { deleteImage } = require('../helpers/deleteImage');
const { createJSONWebToken } = require('../helpers/jsonwebtoken');
const { jwtActivationKey, clientURL } = require('../secret');
const emailWithNodeMailer = require('../helpers/email');


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

        const image = req.file;

        if (!image) {
            throw createError(400, 'Image field is required.')
        }

        if (image.size > 1024 * 1024 * 2) {
            throw createError(400, 'File size must be between 2 MB')
        }

        // console.log(image);
        // console.log(image);

        const imageBufferString = image.buffer.toString('base64');

        const userExists = await User.exists({ email: email });

        if (userExists) {
            throw createError(409, 'User already exists');
        }

        // , image: imageBufferString
        //create JWT token
        const token = createJSONWebToken({ name, email, password, phone, address }, jwtActivationKey, '10m');

        //prepare email
        const emailData = {
            email: email,
            subject: 'Account Activation Email',
            html: `
                <h2>Hello ${name} ! </h2>
                <p>Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">Activate your account</a></p>
            `,
        }

        try {
            await emailWithNodeMailer(emailData);
        } catch (error) {
            next(createError(500, 'Failed to send verification mail'));
        }
        
        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for complete verification`,
            payload: { newUser, token, image: imageBufferString }
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

        const searchRegex = new RegExp('.*' + search + '.*', 'i');  // here 'i' means case insensitive
        const filter = {
            isAdmin: {$ne: true},    //The $ne operator in MongoDB stands for "not equal"
            $or: [
                { name: { $regex: searchRegex } },    // Match if 'name' field matches regex pattern
                { email: { $regex: searchRegex } },   // Match if 'email' field matches regex pattern
                { phone: { $regex: searchRegex } },   // Match if 'phone' field matches regex pattern
            ]
        }
        const options = { password: 0 }

        const users = await User.find(filter, options).limit(limit).skip((page -1) * limit);
        const count = await User.find(filter).countDocuments();

        if (!users) throw createError(404, 'User not found');

        // res.status(200).send({
        //     message: 'All user data',
        //     totalCount: users.length,
        //     users,
        //     pagination: {
        //         totalPages: Math.ceil(count / limit),
        //         currentPage: page,
        //         previousPage: page - 1 > 0 ? page - 1 : null,
        //         nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
        //     }
        // });

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

        const user = await findWithId(User, id, options);

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
        const options = { password: 0 };

        const user = await findWithId(User, id, options);

        const userImagePath = user.image;

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
        deleteImage(userImagePath);

        await User.findByIdAndDelete({ _id: id, isAdmin: false });

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
        const updateOptions = { new: true, runValidators: true, Context: 'query' };

        let updates = {}

        if (req.body.name) {
            updates.name = req.body.name;
        }

        if (req.body.password) {
            updates.password = req.body.password;
        }

        if (req.body.phone) {
            updates.phone = req.body.phone;
        }

        if (req.body.address) {
            updates.address = req.body.address;
        }

        const image = req.file;

        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, 'File size must be between 2 MB')
            } 
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'User updated successfully',
        });
    } catch (error) {   
        next(error);
    }
}

module.exports = { processRegister, getUsers, getUserById, deleteUserById, activeUserAccount, updateUserById };