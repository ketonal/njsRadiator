var express = require('express');
var router = express.Router();
var config = require('./config');

/* GET setup main page. */
router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
    res.render('setup', {title: 'Setup'});
});

router.get('/getConfig', function(req, res){
    res.send(config.cfg);
});

router.post('/setConfig', function(req, res){
    var config = req.body.config;
    console.log(config);
    config.cfg = config;
    config.storeConfig();
});

module.exports = router;

