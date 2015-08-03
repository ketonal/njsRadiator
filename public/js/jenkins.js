(function(app){
    var module = app || {};

    function JenkinsViewModel() {
        var self = this;
        self.lastColumnNo = 0;
        self.jobs = ko.observableArray();
        self.refreshInterval = 30;
        self.timerValue = ko.observable(self.refreshInterval);
        self.timerProgress = ko.observable(100);
        self.timerProgressPercent = ko.computed(function(){return self.timerProgress() + '%';});

        self.postProcess = function(e) {
            var cols = $(e).parent().parent().find('.three.column.grid .column');
            $(cols[self.lastColumnNo++]).append(e);
            if(self.lastColumnNo == cols.length) {
                self.lastColumnNo = 0;
            }
        }
        self.getLastBuildInfo = function(job) {
            getLastBuildInfo(job);
        }

        //init by getting all jobs from server
        getJobs(self.jobs);

        setInterval(function() {
            self.timerValue(self.timerValue() - 1);
            self.timerProgress((100 * self.timerValue()) / self.refreshInterval);
            if(self.timerValue() == 0) {
                self.timerValue(30);
                refreshJobsInfo(self.jobs());
            }
        }, 1000);

        return self;
    }

    function getJobs(jobs, filter) {
        $.ajax({
            type: 'GET',
            url: '/radiator/jobs' + (filter ? '/name/' + filter.name + '/type/' + filter.type : ''),
            dataType: 'json',
            data: {},
            success: function(data) {
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

    function getJobInfo(job, fn) {
        $.ajax({
            type: 'GET',
            url: '/radiator/jobInfo/' + job.name(),
            dataType: 'json',
            data: {},
            success: function(data) {
                ko.mapping.fromJS(data, {}, job);
                if(fn) {
                    fn.apply(self, [job]);
                }
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
            getJobInfo(job, function(j){
                j.loading(false);
                j.detailsLoaded(true);
                j.lastBuildInfo().loading(true);
                getLastBuildInfo(j, function(build){
                    j.lastBuildInfo(build);
                    j.lastBuildInfo().loading(false);
                });
            });
        });
    }

    module.JenkinsViewModel = JenkinsViewModel;
    return module;
}((Application)))