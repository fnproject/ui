var express = require('express');
var router = express.Router();

router.use('/api/groups', require('./controllers/groups.js'))

module.exports = router;