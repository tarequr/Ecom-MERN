const mongoose = require('mongoose');
const createError = require('http-errors');
const fs = require('fs').promises;

const User = require('../models/userModel');
const { successResponse } = require('../helpers/responseHandler');
const { findWithId } = require('../services/findItem');
const { deleteImage } = require('../helpers/deleteImage');
const { createJSONWebToken } = require('../helpers/jsonwebtoken');
const { jwtActivationKey, clientURL } = require('../secret');

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

        const userExists = await User.exists({ email: email });

        if (userExists) {
            throw createError(409, 'User already exists');
        }

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

        return successResponse(res, {
            statusCode: 200,
            message: 'User created successfully',
            payload: { newUser, token }
        });
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

module.exports = { processRegister, getUsers, getUserById, deleteUserById };