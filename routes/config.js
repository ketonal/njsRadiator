var jsonfile=require('jsonfile')
var util=require('util')

var cfgFilePath='./appconfig.json'

//basic template config used to first time init
var basicCfg = {
    user: '',
    pass: '',
    jenkinsUrl: 'https://{0}:{1}@jenkins.yourcompany.com/'
}

var cfg = {};

function readConfig(loadComplete) {
    jsonfile.readFile(cfgFilePath, function(err, obj) {
        if(err) {
            initEmptyConfig();
            module.exports.cfg = basicCfg;
        } else {
            module.exports.cfg = obj;
        }
        if(loadComplete){
            loadComplete.apply(this, arguments);
        }
    });
}

function writeConfig() {
    jsonfile.writeFile(cfgFilePath, cfg, function(err) {
        if(err) {
            console.error(err);
        }
    })
}

function initEmptyConfig() {
    jsonfile.writeFile(cfgFilePath, basicCfg, function(err) {
        if(err) {
            console.error(err);
        }
    });
}

//read or init new empty config
readConfig();

module.exports = {
    cfg: cfg,
    loadConfig: readConfig,
    storeConfig: writeConfig
}