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
        const accessToken = createJSONWebToken({ user }, jwtAccessKey, '15m');
        res.cookie('accessToken', accessToken, {
            maxAge: 15 * 60 * 1000,  // 15 minutes
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        //refresh JWT token
        const refreshToken = createJSONWebToken({ user }, jwtAccessKey, '7d');
        res.cookie('refreshToken', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        const userWithoutPassword = await User.findOne({ email }).select("-password");

        return successResponse(res, {
            statusCode: 200,
            message: 'User logged in successfully!',
            payload: { userWithoutPassword }
        });
    } catch (error) {   
        next(error);
    }
}

const handleLogout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken');

        return successResponse(res, {
            statusCode: 200,
            message: 'User logged out successfully!'
        });
    } catch (error) {   
        next(error);
    }
}

const handleRefreshToken = async (req, res, next) => {
    try {
        res.clearCookie('accessToken');
        const oldRefreshToken = req.cookie.refreshToken;

        //verify the old refresh token

        return successResponse(res, {
            statusCode: 200,
            message: 'User logged out successfully!'
        });
    } catch (error) {   
        next(error);
    }
}


module.exports = { handleLogin, handleLogout, handleRefreshToken };