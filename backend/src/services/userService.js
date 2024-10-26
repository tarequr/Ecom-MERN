const createError = require("http-errors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const { createJSONWebToken } = require('../helpers/jsonwebtoken');
const { clientURL, jwtResetPasswordKey } = require('../secret');
const { deleteImage } = require("../helpers/deleteImage");
const { default: mongoose } = require("mongoose");
const emailWithNodeMailer = require("../helpers/email");

const findUsers = async (search, limit, page) => {
    try {
        const searchRegex = new RegExp('.*' + search + '.*', 'i');  // here 'i' means case insensitive
        const filter = {
            isAdmin: {$ne: true},    //The $ne operator in MongoDB stands for "not equal"
            $or: [
                { name: { $regex: searchRegex } },    // Match if 'name' field matches regex pattern
                { email: { $regex: searchRegex } },   // Match if 'email' field matches regex pattern
                { phone: { $regex: searchRegex } },   // Match if 'phone' field matches regex pattern
            ]
        }
        const options = { password: 0 }

        const users = await User.find(filter, options).limit(limit).skip((page -1) * limit);
        const count = await User.find(filter).countDocuments();

        if (!users) throw createError(404, 'User not found');

        // res.status(200).send({
        //     message: 'All user data',
        //     totalCount: users.length,
        //     users,
        //     pagination: {
        //         totalPages: Math.ceil(count / limit),
        //         currentPage: page,
        //         previousPage: page - 1 > 0 ? page - 1 : null,
        //         nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
        //     }
        // });

        return { users, count };
    } catch (error) {
        throw (error);
    }
}

const findUserById = async (id, options={}) => {
    try {
        const user = User.findById(id, options);
        if (!user) throw createError(404, 'User not found');
        return user;
    } catch (error) {
        throw (error);
    }
}

const handleUpdateUserById = async (userId, req) => {
    try {
        const options = { password: 0 };
        const user = await findUserById(userId, options);

        const updateOptions = { new: true, runValidators: true, Context: 'query' };

        let updates = {}

        // if (req.body.name) {
        //     updates.name = req.body.name;
        // }

        // if (req.body.password) {
        //     updates.password = req.body.password;
        // }

        // if (req.body.phone) {
        //     updates.phone = req.body.phone;
        // }

        // if (req.body.address) {
        //     updates.address = req.body.address;
        // }

        for (let key in req.body) {
            if (['name', 'password', 'phone', 'address'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['email'].includes(key)) {
                throw createError(400, 'Email can not be updated.');
            }
        }

        const image = req.file?.path;

        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, 'File size must be between 2 MB')
            } 

            // updates.image = image.buffer.toString('base64');
            updates.image = image;
            user.image != 'default.png' && deleteImage(user.image);
        }

        // delete updates.email;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");

        if (!updatedUser) {
            throw createError(404, 'User with this id does not exist');
        }

        return updatedUser;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, 'Invalid ID');
        }
        throw (error);
    }
}

const handleDeleteUserById = async (id) => {
    try {
        const user = await User.findByIdAndDelete({ _id: id, isAdmin: false });
        
        if (user && user.image) {
            deleteImage(user.image)
        }
    } catch (error) {
        throw (error);
    }
}


const hadleUserAction = async (userId, action) => {
    try {
        let update;
        let successMessage;

        if (action == 'ban') {
            update = { isBanned: true }
            successMessage = "User is banned successfully!";
        } else if (action == 'unban') {
            update = { isBanned: false }
            successMessage = "User is unbanned successfully!";
        } else {
            throw createError(400, 'Invalid action. Use "ban" or "unban"');
        }

        const updateOptions = { new: true, runValidators: true, Context: 'query' };

        const updatedUser = await User.findByIdAndUpdate(userId, update, updateOptions).select("-password");

        if (!updatedUser) {
            throw createError(400, `User was not ${successMessage} successfully`);
        }

        return { successMessage, updatedUser };
    } catch (error) {
        throw (error);
    }
}

const hadleUserPasswordUpdate = async (email, userId, oldPassword, newPassword, confirmPassword) => {
    try {
        const user = await User.findOne({ email: email });
        
        if (!user) {
            throw createError(400, 'User was not found with this email');
        }

        if (newPassword !== confirmPassword) {
            throw createError(400, 'Confirmation password does not match the new password!');
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            throw createError(401, 'Old password is not correct!');
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { password:  newPassword }, { new: true }).select("-password");

        if (!updatedUser) {
            throw createError(400, 'Password updated failed!');
        }

        return updatedUser;
    } catch (error) {
        throw (error);
    }
}

const hadleUserForgetPasswordByEmail = async (email) => {
    try {
        const userData = await User.findOne({ email: email });

        if (!userData) {
            throw createError(404, 'Email is incorrect or you have not verified your email.');    
        }

        //create JWT token
        const token = createJSONWebToken({ email }, jwtResetPasswordKey, '10m');

        //prepare email
        const emailData = {
            email: email,
            subject: 'Reset Password Email',
            html: `
                <h2>Hello ${userData.name} ! </h2>
                <p>Please click here to <a href="${clientURL}/api/users/reset-password/${token}" target="_blank">Reset your password</a></p>
            `,
        }

        try {
            await emailWithNodeMailer(emailData);
        } catch (error) {
            throw createError(500, 'Failed to send reset password mail');
        }

        return token;
    } catch (error) {
        throw (error);
    }
}

const hadleUserResetPassword = async (token, password) => {
    try {
        const decoded = jwt.verify(token, jwtResetPasswordKey);
        
        if (!decoded) {
            throw createError(400, "Invalid or expired token");
        }

        const filter = { email: decoded.email }
        const updatedUser = await User.findOneAndUpdate(filter, { password:  password }, { new: true }).select("-password");

        if (!updatedUser) {
            throw createError(400, 'Password reset failed!');
        }

        return updatedUser;
    } catch (error) {
        throw (error);
    }
}

module.exports = { findUsers, findUserById, handleUpdateUserById, handleDeleteUserById, hadleUserAction, hadleUserPasswordUpdate, hadleUserForgetPasswordByEmail, hadleUserResetPassword }