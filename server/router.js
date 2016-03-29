var express = require('express');
var router = express.Router();

router.use('/images', require('./controllers/images.js'))

module.exports = router;