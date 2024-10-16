const jwt = require("jsonwebtoken");
const createError = require('http-errors');
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw createError(401, 'Access token not found');
        }

        const decoded = jwt.verify(accessToken, jwtAccessKey);

        if (!decoded) {
            throw createError(401, 'Invalid access token. Please login again');
        }

        req.body.userId = decoded._id;

        next();
    } catch (error) {
        return next(error);
    }
}

const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, jwtAccessKey);
                if (decoded) {
                    throw createError(400, 'User already logged in.');
                }
            } catch (error) {
                return error;
            }
        }

        next();
    } catch (error) {
        return next(error);
    }
}

module.exports = { isLoggedIn, isLoggedOut }