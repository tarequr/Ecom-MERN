const jwt = require('jsonwebtoken');

const createJSONWebToken = (payload, secretKey, expiresIn) => {
    if (!payload || typeof payload != 'object') {
       throw new Error('Payload must be a non-empty object'); 
    }

    if (secretKey ==  '' || typeof secretKey !== 'string') {
        throw new Error('Secret key must be a non-empty string'); 
    }

    try {
        const token = jwt.sign(payload, secretKey, { expiresIn });
        return token;
    } catch (error) {
        console.error('Failed to sign the JWT', error);
        throw error;
    }
}

module.exports = { createJSONWebToken }