require('dotenv').config();
const serverPort = process.env.PORT || 8080;
const mongodbURL = process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerce";
const defaultImagePath = process.env.DEFAULT_IMAGE || "public/images/default.png";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "jwtActivationKey";

const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL

module.exports = { serverPort, mongodbURL, defaultImagePath, jwtActivationKey, smtpUsername, smtpPassword, clientURL }