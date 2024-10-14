const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        console.log(token);
    } catch (error) {
        return next(error);
    }
}

module.exports = { isLoggedIn }