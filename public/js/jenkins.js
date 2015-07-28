(function(app){
    var module = app || {};

    function JenkinsViewModel() {
        var self = this;
        self.jobs = ko.observableArray();

        self.getLastBuildInfo = function(job) {
            getLastBuildInfo(job);
        }

        //init by getting all jobs from server
        getAllJobs(self.jobs);
        return self;
    }

    function getAllJobs(jobs) {
        $.ajax({
            type: 'GET',
            url: '/radiator/getJobs',
            dataType: 'json',
            data: {},
            success: function(data) {
                console.log(arguments);
                jobs(_.map(data, function(j){
                    return new module.Job(j);
                }));
                refreshJobsInfo(jobs());
            },
            error: function() {
                console.log(arguments);
            }
        })
    };

    function getJobInfo(job) {
        $.ajax({
            type: 'GET',
            url: '/radiator/getJobInfo/' + job.name(),
            dataType: 'json',
            data: {},
            success: function(data) {
                console.log(data);
                ko.mapping.fromJS(data, {}, job);
                job.loading(false);
                job.detailsLoaded(true);
            },
            error: function() {
                console.log(arguments);
            }
        })
    };

    function getBuildInfo(job, buildNo, fn) {
        $.ajax({
            type: 'GET',
            url: '/getBuildInfo/' + job.name() + '/' + buildNo,
            dataType: 'json',
            data: {},
            success: function(data) {
                console.log(data);
                var build = new module.Build(data);
                fn.apply(build);
            },
            error: function() {
                console.log(arguments);
            }
        })
    };

    function getLastBuildInfo(job, buildNo, fn) {
        $.ajax({
            type: 'GET',
            url: '/getLastBuildInfo/' + job.name(),
            dataType: 'json',
            data: {},
            success: function(data) {
                console.log(data);
                var build = new module.Build(data);
                fn.apply(build);
            },
            error: function() {
                console.log(arguments);
            }
        })
    };

    function refreshJobsInfo(jobs) {
        _.forEach(jobs, function(job) {
            job.loading(true);
            getJobInfo(job);
        });
    }

    module.JenkinsViewModel = JenkinsViewModel;
    return module;
}((Application)))