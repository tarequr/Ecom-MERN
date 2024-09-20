const createError = require('http-errors');
// const users = require('../models/userModel');

const getUsers = (req, res, next) => {
    try {
        res.status(200).send({
            message: 'All user data',
            // users
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { getUsers };