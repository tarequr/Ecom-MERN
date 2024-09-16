const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.status(200).send("<h1>Welcome to E-commerce Project</h1>");
});

app.get('/test', (req, res) => {
    return res.status(200).send({ message: 'API Testing is Working Properly' });
});



/* ERROR HANDLING */

//Client error handling
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found.' });
    next();
});

//Serverr error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});