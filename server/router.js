var express = require('express');
var router = express.Router();

router.use('/api/apps', require('./controllers/apps.js'))
router.use('/api/apps', require('./controllers/routes.js'))
//router.use('/api/apps', require('./controllers/jobs.js'))

module.exports = router;