const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan("dev"));

app.get('/', (req, res) => {
    return res.status(200).send("<h1>Welcome to E-commerce Project</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});