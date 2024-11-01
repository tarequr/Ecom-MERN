const { Schema, model } = require('mongoose');
const { defaultImagePath } = require('../secret');

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name field is required.'],
        trim: true,
        minlength: [3, 'The name must be at least 3 characters long.'],
    },
    slug: {
        type: String,
        required: [true, 'The slug field is required.'],
        lowercase: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'The description field is required.'],
        trim: true,
        minlength: [3, 'The name must be at least 3 characters long.'],
    },
    price: {
        type: Number,
        required: [true, 'The price field is required.'],
        trim: true,
        validate: {
            validator: (v) => {
                return v > 0;
            },
            message: (props) => {
                `${props.value} is not a valid price! Please try again`;
            }
        }
    },
    quantity: {
        type: Number,
        required: [true, 'The quantity field is required.'],
        trim: true,
        validate: {
            validator: (v) => {
                return v > 0;
            },
            message: (props) => {
                `${props.value} is not a valid quantity! Please try again`;
            }
        }
    },
    sold: {
        type: Number,
        required: [true, 'The sold quantity field is required.'],
        trim: true,
        default: 0,
        validate: {
            validator: (v) => {
                return v > 0;
            },
            message: (props) => {
                `${props.value} is not a valid sold quantity! Please try again`;
            }
        }
    },
    shipping: {
        type: Number,
        default: 0 // shipping free or paid somthing amount
    },
    image: {
        // type: Buffer,
        // contentType: String,

        type: String,
        default: defaultImagePath,
        // required: [true, 'The image field is required.'],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    status: {
        type: Boolean,
        default: true,
    }
}, {timestamps: true});

module.exports = model('Porduct', productSchema);