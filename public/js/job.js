(function(rApp){
    var module = rApp || {};

    function Job(data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);
        self.loading = ko.observable(false);
        self.detailsLoaded = ko.observable(false);

        return self;
    }

    function Build(data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);
        self.loading = ko.observable(false);
        self.reportLoaded = ko.observable(false);

        return self;
    }

    module.Job = Job;
    module.Build = Build;
    return module;
}(Radiator))