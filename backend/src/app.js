const express = require('express');
const morgan = require('morgan');

const bodyParser = require('body-parser'); //for express middleware
const createError = require('http-errors');  //for error handling
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit');

const app = express();

const rateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: 'Too many requests from this IP. Please try again later'
});

app.use(rateLimiter);
app.use(xssClean());  //API secure
app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', require('./routers/userRouter.js'));
app.use('/api/seed', require('./routers/seedRouter.js'));



app.get('/', (req, res) => {
    return res.status(200).send("<h1>Welcome to E-commerce Project</h1>");
});

app.get('/test', rateLimiter, (req, res) => {
    return res.status(200).send({ message: 'API Testing is Working Properly' });
});

/* ERROR HANDLING */

//Client error handling
app.use((req, res, next) => {
    // 1st way
    // res.status(404).json({ message: 'Route not found.' });
    // next();

    //2nd way
    // createError(404, 'Route not found.');
    // next();

    //3rd way
    next(createError(404, 'Route not found.'));
});

//Serverr error handling - all the errors
app.use((err, req, res, next) => {
    // console.error(err.stack);
    // res.status(500).send('Something broke!');

    return res.status(err.status || 500).json({
        success: false,
        message: err.message // this message come from next(createError(404, 'Route not found.'));
    });
});

module.exports = app;