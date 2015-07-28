var express = require('express');
var path = require('path');
var config = require('./config');
var router = express.Router();

router.get('/:filter?', function(req, res){
    console.log('radiator: ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    if(req.params.filter) {
        config.cfg.filter = req.params.filter;
        console.log('Setting getAllJobs filter to: ' + req.params.filter);
    } else {
        res.redirect('/setup');
        return;
    }
    res.location('/radiator');
    res.render('radiator');
});

module.exports = router;
