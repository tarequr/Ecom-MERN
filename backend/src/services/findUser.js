const mongoose = require('mongoose');
const createError = require('http-errors');
const User = require('../models/userModel');

const findUserById = async (id) => {
    try {
        const options = { password: 0 };
        const user = await User.findById(id, options);

        if (!user) {
            throw createError(404, "User does not exist!");
        }

        return user;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createError(400, "Invalid user ID");
        }

        throw error;
    }
}

module.exports = { findUserById };