require('dotenv').config();
const serverPort = process.env.PORT || 8080;
const mongodbURL = process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerce";

module.exports = { serverPort, mongodbURL }