(function(app){
    var module = app || {};

    function JenkinsViewModel() {
        var self = this;
        self.jobs = ko.observableArray();

        self.getLastBuildInfo = function(job) {
            getLastBuildInfo(job);
        }

        //init by getting all jobs from server
        getJobs(self.jobs, module.JobsFilter);
        return self;
    }

    function getJobs(jobs, filter) {
        $.ajax({
            type: 'GET',
            url: '/radiator/jobs' + (filter ? '/name/' + filter.name + '/type/' + filter.type : ''),
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
            url: '/radiator/jobInfo/' + job.name(),
            dataType: 'json',
            data: {},
            success: function(data) {
                console.log(data);
                ko.mapping.fromJS(data, {}, job);
                job.loading(false);
                job.detailsLoaded(true);
                getLastBuildInfo(job, function(build){
                    job.lastBuildInfo(build);
                });
            },
            error: function() {
                console.log(arguments);
            }
        })
    };

    function getBuildInfo(job, buildNo, fn) {
        $.ajax({
            type: 'GET',
            url: '/radiator/buildInfo/' + job.name() + '/' + buildNo,
            dataType: 'json',
            data: {},
            success: function(data) {
                console.log(data);
                var build = new module.Build(data);
                if(fn) {
                    fn.apply(self, [build]);
                }
            },
            error: function() {
                console.log(arguments);
            }
        })
    };

    function getLastBuildInfo(job, fn) {
        $.ajax({
            type: 'GET',
            url: '/radiator/lastBuildInfo/' + job.name(),
            dataType: 'json',
            data: {},
            success: function(data) {
                console.log(data);
                var build = new module.Build(data);
                if(fn) {
                    fn.apply(self, [build]);
                }
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