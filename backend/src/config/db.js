const mongoose = require('mongoose');
const { mongodbURL } = require('../secret');
const logger = require('../controllers/loggerController');

const connectDatabase = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options);
        // console.log("Connected to MongoDB");
        logger.log('info', 'Connected to MongoDB');

        mongoose.connection.on('error', (error) => {
            logger.log('error', "Connection error: ", error);
        });
    } catch (error) {
        logger.log('error', "Could not connect to DB: ", error.toString());
    }
}

module.exports = connectDatabase