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

router.get('/job/:name', function(req, res, next) {
    jenkins.job_info(req.params.name, function(err, data){
        if(err) {
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
function getJobInfo(jobName, req, res) {
    jenkins.job_info(jobName, function(err, data){
        if(err) {
            return console.log(err);
        }
        res.send(data);
    });
};
function getBuildInfo(jobName, buildNo, req, res) {
    jenkins.build_info(jobName, buildNo, function(err, data) {
        if (err){
            return console.log(err);
        }
        res.send(data);
    });
};
function getLastBuildInfo(jobName, req, res){
    jenkins.last_build_info(jobName, function(err, data) {
        if (err){
            return console.log(err);
        }
        res.send(data);
    });
};
function getLastBuildReport(jobName, req, res){
    jenkins.last_build_report(jobName, function(err, data) {
        if (err){
            return console.log(err);
        }
        res.send(data);
    });
};

module.exports = router;
