var jsonfile=require('jsonfile')
var util=require('util')

var cfgFilePath='./appconfig.json'

//basic template config used to first time init
var basicCfg = {
    user: '',
    pass: '',
    jenkinsUrl: 'https://{0}:{1}@jenkins.yourcompany.com/'
}

function readConfig(loadComplete) {
    jsonfile.readFile(cfgFilePath, function(err, obj) {
        if(err) {
            initEmptyConfig();
            module.exports.cfg = basicCfg;
            console.dir('Initialized empty config:');
            console.dir(basicCfg);
        } else {
            module.exports.cfg = obj;
            console.dir('Loaded config:');
            console.dir(obj);
        }
        if(loadComplete) {
            loadComplete.apply(this, arguments);
        }
    });
}

function writeConfig(newConfig) {
    jsonfile.writeFile(cfgFilePath, newConfig, function(err) {
        if(err) {
            console.error(err);
        }
        module.exports.cfg = newConfig;
    })
}

function initEmptyConfig() {
    jsonfile.writeFile(cfgFilePath, basicCfg, function(err) {
        if(err) {
            console.error(err);
        }
    });
}

module.exports = {
    cfg: {},
    loadConfig: readConfig,
    storeConfig: writeConfig
}