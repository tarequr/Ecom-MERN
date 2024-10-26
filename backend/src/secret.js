require('dotenv').config();
const serverPort = process.env.PORT || 8080;
const mongodbURL = process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerce";
const defaultImagePath = process.env.DEFAULT_IMAGE || "public/images/default.png";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "jwtActivationKey";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "myaccesskey";
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || "myresetpasswordkey";

const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL

module.exports = { serverPort, mongodbURL, defaultImagePath, jwtActivationKey, jwtAccessKey, jwtResetPasswordKey, smtpUsername, smtpPassword, clientURL }