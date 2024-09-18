const app = require('./app');
const { serverPort } = require('./secret');

app.listen(serverPort, () => {
    console.log(`Server running on http://localhost:${serverPort}`);
});