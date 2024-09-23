const mongoose = require('mongoose');
const createError = require('http-errors');

const User = require('../models/userModel');
const { successResponse } = require('../helpers/responseHandler');
const { findUserById } = require('../services/findUser');

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

const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        
        const user = await findUserById(id);

        return successResponse(res, {
            statusCode: 200,
            message: 'User data fatch successfully',
            payload: { user }
        });
    } catch (error) {   
        next(error);
    }
}

module.exports = { getUsers, getUser };