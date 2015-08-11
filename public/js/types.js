(function(app){
    var module = app || {};

    function Job(data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);
        self.loading = ko.observable(false);
        self.detailsLoaded = ko.observable(false);
        self.lastBuildInfo = ko.observable(new Build());
        return self;
    }

    function Build(data) {
        var self = this;
        if(data) {
            self.changeSet = ko.mapping.fromJS(data.changeSet);
            ko.mapping.fromJS(data, {}, self);
            //is this ok? won't they be overwtirrent?
            self.actions = {};
            _.map(data.actions, function(action){ko.mapping.fromJS(action, {}, self.actions);});
        }
        self.loading = ko.observable(false);
        self.reportLoaded = ko.observable(false);
        self.gitCommitUrl = ko.computed(function(){
            if(self.actions && self.actions.remoteUrls) {
                var regex = /^.*@(.*)\/project\/(.*)$/;
                var match = regex.exec(self.actions.remoteUrls()[0]);
                if(match.length >= 3 && self.changeSet.items().length > 0) {
                    var url = 'http://' + match[1] + '/?p=' + match[2] + ';a=commitdiff;h=' + self.changeSet.items()[0].commitId();
                    return url;
                }
            }
        });
        return self;
    }

    function Config(data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);
        self.loading = ko.observable(false);
        return self;
    }

    module.Job = Job;
    module.Build = Build;
    module.Config = Config;
    return module;
}(Application))