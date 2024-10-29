const createError = require('http-errors');
const emailWithNodeMailer = require('./email');

const sendEmail = async (emailData) => {
    try {
        await emailWithNodeMailer(emailData);
    } catch (error) {
        throw createError(500, 'Failed to send verification mail');
    }
}

module.exports = { sendEmail }