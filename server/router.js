var express = require('express');
var router = express.Router();

router.use('/api/groups', require('./controllers/groups.js'))
router.use('/api/groups', require('./controllers/jobs.js'))

module.exports = router;