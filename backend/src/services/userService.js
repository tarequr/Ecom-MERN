const createError = require("http-errors");
const User = require("../models/userModel");
const { deleteImage } = require("../helpers/deleteImage");

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

module.exports = { findUsers, findUserById, handleDeleteUserById, hadleUserAction }