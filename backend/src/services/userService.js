const createError = require("http-errors");
const User = require("../models/userModel");

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

module.exports = { hadleUserAction }