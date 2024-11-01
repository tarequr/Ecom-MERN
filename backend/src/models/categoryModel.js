const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name field is required.'],
        unique: true,
        trim: true,
        minlength: [3, 'The name must be at least 3 characters long.'],
    },
    slug: {
        type: String,
        required: [true, 'The slug field is required.'],
        lowercase: true,
        unique: true,
    },
    status: {
        type: Boolean,
        default: true,
    }
}, {timestamps: true});

module.exports = model('Category', categorySchema);