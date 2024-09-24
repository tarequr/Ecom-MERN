const mongoose = require('mongoose');
const createError = require('http-errors');
const User = require('../models/userModel');

const findWithId = async (Model, id, options = {}) => {
    try {
        const item = await Model.findById(id, options);

        if (!item) {
            throw createError(404, `${Model.modelName} does not exist!`);
        }

        return item;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createError(400, "Invalid Item ID");
        }

        throw error;
    }
}

module.exports = { findWithId };