var express = require('express');
var router = express.Router();

router.use('/api/apps', require('./controllers/apps.js'))
router.use('/api/apps', require('./controllers/routes.js'))
router.use('/api/info', require('./controllers/info.js'))

module.exports = router;