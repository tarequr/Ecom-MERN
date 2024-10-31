const mongoose = require('mongoose');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
;
const { successResponse } = require('../helpers/responseHandler');

const { createJSONWebToken } = require('../helpers/jsonwebtoken');
const { jwtActivationKey, clientURL, jwtResetPasswordKey } = require('../secret');
const emailWithNodeMailer = require('../helpers/email');

const { sendEmail } = require('../helpers/sendEmail');


const handleCreateCategory = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const newUser = {
            name, 
            email, 
            password, 
            phone, 
            address
        }

        // const image = req.file;

        // if (!image) {
        //     throw createError(400, 'Image field is required.')
        // }

        // if (image.size > 1024 * 1024 * 2) {
        //     throw createError(400, 'File size must be between 2 MB')
        // }

        // const imageBufferString = image.buffer.toString('base64');

        // anoher way
        const image = req.file?.path;
        if (image && image.size > 1024 * 1024 * 2) {
            throw createError(400, 'File size must be between 2 MB')
        }

        const userExists = await checkUserExists(email);

        if (userExists) {
            throw createError(409, 'User already exists');
        }

        // , image: imageBufferString
        //create JWT token
        const tokenPayload = { name, email, password, phone, address }
        if (image) {
            tokenPayload.image = image;
        }

        const token = createJSONWebToken(tokenPayload, jwtActivationKey, '10m');

        //prepare email
        const emailData = {
            email: email,
            subject: 'Account Activation Email',
            html: `
                <h2>Hello ${name} ! </h2>
                <p>Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">Activate your account</a></p>
            `,
        }

        sendEmail(emailData);
        
        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for complete verification`,
            payload: { newUser, token }
        });
    } catch (error) {   
        next(error);
    }
}


module.exports = { handleCreateCategory };