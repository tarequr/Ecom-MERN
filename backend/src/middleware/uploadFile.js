const multer  = require('multer')
const fs = require('fs');  // Make sure to import the 'fs' module
// const path = require('path');
// const createError = require('http-errors');
const { UPLOAD_USER_IMG_DIRECTORY, MAX_FILE_SIZE, FILE_TYPES } = require('../config');

// Ensure the upload directory exists, or create it
// if (!fs.existsSync(UPLOAD_USER_IMG_DIRECTORY)) {
//     fs.mkdirSync(UPLOAD_USER_IMG_DIRECTORY, { recursive: true });
// }

// 1st way
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, UPLOAD_USER_IMG_DIRECTORY)
//     },
//     filename: function (req, file, cb) {
//         const extname = path.extname(file.originalname);
//         cb(null, Date.now() + '-' + file.originalname.replace(extname, '') + extname);
//     }
// })

// 2nd way
// const userStorage = multer.memoryStorage();

// 3rd way
const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_USER_IMG_DIRECTORY)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// 1st way
// const fileFilter = (req, file, cb) => {                 //cb means callback  
//     const extname = path.extname(file.originalname);

//     if (!FILE_TYPES.includes(extname.substring(1))) {
//         return cb(createError(400, 'File type not allowed'));
//     }

//     cb(null, true);
// }

// 2nd way
// const fileFilter = (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//         return cb(new Error('Only image files are allowed'), false);
//     }

//     if (file.size > MAX_FILE_SIZE) {
//         return cb(new Error('File size exceeds the maximum limit'), false);
//     }

//     if (!FILE_TYPES.includes(file.mimetype)) {
//         return cb(new Error('File type is not allowed'), false);
//     }

//     cb(null, true);
// }

// 3rd way
const fileFilter = (req, file, cb) => {
    if (!FILE_TYPES.includes(file.mimetype)) {
        return cb(new Error('File type is not allowed'), false);
    }

    cb(null, true);
}

const uploadUserImage = multer({ 
    storage: userStorage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileFilter
});

module.exports = uploadUserImage;