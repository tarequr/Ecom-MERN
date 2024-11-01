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
        const { name } = req.body;

        return successResponse(res, {
            statusCode: 200,
            message: 'Category created successfully!',
            payload: { name }
        });
    } catch (error) {   
        next(error);
    }
}


module.exports = { handleCreateCategory };