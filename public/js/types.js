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
        ko.mapping.fromJS(data, {}, self);
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