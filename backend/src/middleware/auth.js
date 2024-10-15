const jwt = require("jsonwebtoken");
const createError = require('http-errors');
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            throw createError(401, 'Access token not found');
        }

        const decoded = jwt.verify(token, jwtAccessKey);

        if (!decoded) {
            throw createError(401, 'Invalid access token. Please login again');
        }
        // console.log(decoded);

        req.body.userId = decoded._id;

        console.log(req.userId);
        next();
    } catch (error) {
        return next(error);
    }
}

module.exports = { isLoggedIn }