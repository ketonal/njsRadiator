var express = require('express');
var path = require('path');
var format = require('string-format');
var jenkinsApi = require('jenkins-api');
var config = require('./config');
var router = express.Router();

var storedFilterParams = {};  //holding params per referer/ip/request
var jenkins;

config.loadConfig(function(err, cfg){
console.dir(config);
    jenkinsConnect();
});

router.get('/', function(req, res, next){
    console.dir(jenkins);
    jenkinsConnect();
    res.render('radiator');
});

router.get('^(/name/:name?)?(/type/:type?)?', function(req, res){
    console.dir(req.params);
    //add checking against empty/bad config and redirect to setup then?
    storedFilterParams[req.get('host')] = {name: req.params.name, type: req.params.type};
    console.dir(storedFilterParams);
    res.location('/radiator');
    res.render('radiator');
});

router.get('^\/jobs(\/name\/:name?\/type\/:type?)?', function(req, res, next) {
    console.dir(req.params);
    if(req.params.length > 0) {
        getJobs(req, res, {name: req.params.name, type: req.params.type});
    } else if(storedFilterParams[req.get('host')] && (storedFilterParams[req.get('host')].name || storedFilterParams[req.get('host')].type)) {
        getJobs(req, res, storedFilterParams[req.get('host')]);
    } else {
        getJobs(req, res);
    }
});

router.get('/jobInfo/:name', function(req, res, next) {
    jenkins.job_info(req.params.name, function(err, data){
        if(err) {
            return console.dir(err);
        }
        res.send(data);
    });
});

router.get('/buildInfo/:jobName/:buildNo', function(req, res, next) {
    jenkins.last_build_info(req.params.jobName, req.params.buildNo, function(err, data) {
        if (err){
            return console.dir(err);
        }
        res.send(data);
    });
});

router.get('/lastBuildInfo/:jobName', function(req, res, next) {
    jenkins.last_build_info(req.params.jobName, function(err, data) {
        if (err){
            return console.dir(err);
        }
        res.send(data);
    });
});

router.get('/lastBuildReport/:jobName', function(req, res, next) {
    jenkins.last_build_report(req.params.jobName, function(err, data) {
        if (err){
            return console.dir(err);
        }
        res.send(data);
    });
});

//jenkins util functions - obsolete - move to call from router
function jenkinsConnect() {
    console.log('Initializing jenkins connection...');
    jenkins = jenkinsApi.init(format(config.cfg.jenkinsUrl, config.cfg.user, config.cfg.pass));
}

function getJobs(req, res, filter) {
    jenkins.all_jobs(function(err, data){
        if(err) {
            console.error(err);
            res.redirect('/setup');
            return;
        }
        if(filter) {
            console.log('filtering results...');
            data = data.filter(function(d){return d.name.indexOf(filter.name) > -1});
        }
        res.send(data);
    });
};

module.exports = router;
