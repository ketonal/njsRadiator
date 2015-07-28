(function(app){
    var module = app || {};

    //maybe in future load config from somewhere...?
    function SetupViewModel(data) {
        var self = this;
        self.config = ko.observable();

        //init setup view model by getting config from server
        getConfig(self.config);
        return self;
    }

    function getConfig(config) {
        $.ajax({
            type: 'GET',
            url: '/setup/getConfig',
            dataType: 'json',
            data: {},
            success: function(data) {
                console.log(arguments);
                config(new module.Config(data));
            },
            error: function() {
                console.log(arguments);
            }
        })
    };

    function init() {
        var SetupVM = new SetupViewModel();
        ko.applyBindings(SetupVM);
        app.SetupVM = SetupVM;
    };

    $(document).ready(function(){
        init();
    });

    module.SetupViewModel = SetupViewModel;
    return module;
}((Application)))