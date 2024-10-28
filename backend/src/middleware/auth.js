const jwt = require("jsonwebtoken");
const createError = require('http-errors');
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken || !refreshToken) {
            throw createError(401, 'Token not found');
        }

        const decoded = jwt.verify(accessToken, jwtAccessKey);

        if (!decoded) {
            throw createError(401, 'Invalid access token. Please login again');
        }

        req.user = decoded.user;

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

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            throw createError(403, 'Forbidden. You must be an administrator');
        }

        next();
    } catch (error) {
        return next(error);
    }
}

module.exports = { isLoggedIn, isLoggedOut, isAdmin }