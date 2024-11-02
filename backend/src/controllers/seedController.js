const createError = require('http-errors');
const User = require('../models/userModel');
const data = require('../data');
const Product = require('../models/productModel');

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

const seedProduct = async (req, res, next) => {
    try {
        // Deleting all products
        await Product.deleteMany({});

        // Inserting new products
        const products = await Product.insertMany(data.products);

        res.status(201).send(products);
    } catch (error) {
        next(error);
    }
}

module.exports = { seedUser, seedProduct };