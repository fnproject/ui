var express = require('express');
var router = express.Router();

router.use('/api/apps', require('./controllers/apps.js'))
router.use('/api/apps', require('./controllers/routes.js'))

module.exports = router;