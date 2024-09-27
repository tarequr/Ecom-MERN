require('dotenv').config();
const serverPort = process.env.PORT || 8080;
const mongodbURL = process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerce";
const defaultImagePath = process.env.DEFAULT_IMAGE || "public/images/default.png";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "jwtActivationKey";

module.exports = { serverPort, mongodbURL, defaultImagePath, jwtActivationKey }