const createError = require('http-errors');
const User = require('../models/userModel');
const data = require('../data');

const seedUser = async (req, res, next) => {
    try {
        // Deleting all users
        await User.deleteMany({});

        // Inserting new users
        const users = await User.insertMany(data.users);

        res.status(201).send(users);
    } catch (error) {
        next(error);
    }
}

module.exports = { seedUser };