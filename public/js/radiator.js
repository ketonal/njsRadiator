(function(app){
    var app = app || {};

    function init() {
        var JenkinsVM = new app.JenkinsViewModel();
        ko.applyBindings(JenkinsVM);
        app.JenkinsVM = JenkinsVM;
    };

    $(document).ready(function(){
        init();
        $('.ui.sticky').sticky({context: '#context'});
    });

    return app;
}(Application));