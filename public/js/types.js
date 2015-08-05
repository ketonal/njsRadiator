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