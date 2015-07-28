(function(rApp){
    var module = rApp || {};

    //maybe in future load config from somewhere...?
    function Config(data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);
        self.loading = ko.observable(false);

        return self;
    }

    module.Config = Config;
    return module;
}(Radiator))