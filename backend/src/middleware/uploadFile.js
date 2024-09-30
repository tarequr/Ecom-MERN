const multer  = require('multer')
const fs = require('fs');  // Make sure to import the 'fs' module
const path = require('path');
const createError = require('http-errors');
const { UPLOAD_USER_IMG_DIRECTORY, MAX_FILE_SIZE, FILE_TYPES } = require('../config');

// Ensure the upload directory exists, or create it
if (!fs.existsSync(UPLOAD_USER_IMG_DIRECTORY)) {
    fs.mkdirSync(UPLOAD_USER_IMG_DIRECTORY, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_USER_IMG_DIRECTORY)
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(null, Date.now() + '-' + file.originalname.replace(extname, '') + extname);
    }
})

const fileFilter = (req, file, cb) => {                 //cb means callback  
    const extname = path.extname(file.originalname);

    if (!FILE_TYPES.includes(extname.substring(1))) {
        return cb(createError(400, 'File type not allowed'));
    }

    cb(null, true);
}

const upload = multer({ 
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
});

module.exports = upload;