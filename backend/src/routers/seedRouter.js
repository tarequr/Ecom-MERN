const express = require('express');
const { seedUser } = require('../controllers/seedController');
let router = express.Router();


router.get("/users", seedUser);

module.exports = router;