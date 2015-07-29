var express = require('express');
var path = require('path');
var format = require('string-format');
var jenkinsApi = require('jenkins-api');
var config = require('./config');
var router = express.Router();

var jenkins;
config.loadConfig(function(err, cfg){
    jenkinsConnect();
});

router.get('/', function(req, res, next){
    res.render('radiator');
});

router.get('^(/name/:name?/type/:type?)?', function(req, res){
    console.log('radiator: ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    if(!config.cfg.user){
        res.redirect('/setup');
        return;
    }
    res.location('/radiator');
    res.render('radiator', {filter: {name: req.params.name, type: req.params.type}});
});

router.get('^\/jobs(\/name\/:name?\/type\/:type?)?', function(req, res, next) {
    console.dir(req.params);
    if(req.params.length > 0) {
        getJobs(req, res, {name: req.params.name, type: req.params.type});
    } else {
        getJobs(req, res);
    }
});

router.get('/jobInfo/:name', function(req, res, next) {
    jenkins.job_info(req.params.name, function(err, data){
        if(err) {
            return console.log(err);
        }
        res.send(data);
    });
});

router.get('/buildInfo/:jobName/:buildNo', function(req, res, next) {
    jenkins.last_build_info(req.params.jobName, req.params.buildNo, function(err, data) {
        if (err){
            return console.log(err);
        }
        res.send(data);
    });
});

router.get('/lastBuildInfo/:jobName', function(req, res, next) {
    jenkins.last_build_info(req.params.jobName, function(err, data) {
        if (err){
            return console.log(err);
        }
        res.send(data);
    });
});

router.get('/lastBuildReport/:jobName', function(req, res, next) {
    jenkins.last_build_report(req.params.jobName, function(err, data) {
        if (err){
            return console.log(err);
        }
        res.send(data);
    });
});

//jenkins util functions - obsolete - move to call from router
function jenkinsConnect() {
    jenkins = jenkinsApi.init(format(config.cfg.jenkinsUrl, config.cfg.user, config.cfg.pass));
}
function getJobs(req, res, filter) {
    jenkins.all_jobs(function(err, data){
        if(err) {
            console.log(err);
            res.redirect('/setup');
            return;
        }
        if(filter) {
            data = data.filter(function(d){return d.name.indexOf(filter) > -1});
        }
        res.send(data);
    });
};

module.exports = router;
