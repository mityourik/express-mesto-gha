const express = require('express');
const notFoundPages = require('../controllers/notFoundPages');

const router = express.Router();

router.all('*', notFoundPages);

module.exports = router;
