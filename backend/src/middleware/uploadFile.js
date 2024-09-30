const multer  = require('multer')
const fs = require('fs');  // Make sure to import the 'fs' module
const path = require('path');
const createError = require('http-errors');

const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 2097152;
const fileTypes   = process.env.FILE_TYPES || ['jpg', 'png', 'jpeg'];

const uploadDir   = process.env.UPLOAD_FILE || "src/public/images/users";

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
        cb(null, Date.now() + '-' + file.originalname.replace(extname, '') + extname);
    }
})

const fileFilter = (req, file, cb) => {                 //cb means callback  
    const extname = path.extname(file.originalname);

    if (!fileTypes.includes(extname.substring(1))) {
        return cb(createError(400, 'File type not allowed'));
    }

    cb(null, true);
}

const upload = multer({ 
    storage: storage,
    limits: { fileSize: maxFileSize },
    fileFilter
});

module.exports = upload;