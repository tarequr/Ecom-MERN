const mongoose = require('mongoose');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { successResponse } = require('../helpers/responseHandler');
const { jwtAccessKey } = require('../secret');
const { createJSONWebToken } = require('../helpers/jsonwebtoken');


const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            throw createError(404, 'User does not exist!');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw createError(401, 'Email/password did not match!');
        }

        if (user.isBanned) {
            throw createError(403, 'You are Banned. Please contact with authority!');
        }

        //create JWT token
        const accessToken = createJSONWebToken({ email }, jwtAccessKey, '10m');
        res.cookie('access_token', accessToken, {
            maxAge: 15 * 60 * 1000,  // 15 minutes
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

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