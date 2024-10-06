const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require('../secret');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name field is required.'],
        trim: true,
        minlength: [3, 'The name must be at least 3 characters long.'],
        maxlenght: [35, 'The name cannot be more than 35 characters long.'],
    },
    email: {
        type: String,
        required: [true, 'The email field is required.'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(value) {
                return /^\w+([\-]?\w+)*@\w+([\-.]?\w+)*(\.\w{2,3})+$/.test(value);
            },
            message: 'Please enter a valid email'
        },
    },
    password: {
        type: String,
        required: [true, 'The password field is required.'],
        minlength: [8, 'The password must be at least 8 characters long.'],
        set: (value) => bcrypt.hashSync(value, bcrypt.genSaltSync(10))
    },
    image: {
        // type: Buffer,
        // contentType: String,

        type: String,
        default: defaultImagePath
        // required: [true, 'The image field is required.'],
    },
    address: {
        type: String,
        required: [true, 'The address field is required.'],
        minlength: [3, 'The address must be at least 3 characters long.'],
    },
    phone: {
        type: String,
        required: [true, 'The phone field is required.'],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

module.exports = model('User', userSchema);