const mongoose = require('mongoose');
const { mongodbURL } = require('../secret');

const connectDatabase = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options);
        console.log("Connected to MongoDB");

        mongoose.connection.on('error', (error) => {
            console.error("Connection error: ", error);
        });
    } catch (error) {
        console.error("Could not connect to DB: ", error.toString());
    }
}

module.exports = connectDatabase