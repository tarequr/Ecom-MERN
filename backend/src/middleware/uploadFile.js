const multer  = require('multer')
const fs = require('fs');  // Make sure to import the 'fs' module
const path = require('path');
const { uploadDir } = require('../secret')

// Ensure the upload directory exists, or create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)
        const extname = path.extname(file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage });

module.exports = upload;