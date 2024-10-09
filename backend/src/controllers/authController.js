const mongoose = require('mongoose');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { successResponse } = require('../helpers/responseHandler');


const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            throw createError(404, 'User does not exist!');
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'User loggedin successfully!',
            payload: { user }
        });
    } catch (error) {   
        next(error);
    }
}

module.exports = { handleLogin };