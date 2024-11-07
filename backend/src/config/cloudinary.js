const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
const cloudinaryConfig = cloudinary.config({
//   secure: true
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Log the configuration
// console.log(cloudinary.config());

module.exports = cloudinaryConfig;