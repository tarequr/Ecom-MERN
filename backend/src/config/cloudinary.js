const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Return "https" URLs by setting secure: true
cloudinary.config({
//   secure: true
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Log the configuration
// console.log(cloudinary.config());

module.exports = cloudinary;