var models = require('../database');
var testRunner = require('../utils/testRunner');
var cron = require('cron').CronJob;
var config = require('../config');
var dbHelper = require('../utils/dbHelper');
var setUp = function () {
};

var scheduledTask = function () {

    models.TestCase.getRunningTests().then(function(testcases) {
        console.log(testcases.length);
        var limit = config.parallelLimit - testcases.length;
        console.log('limit ', limit);
        if (limit > 0) {
            models.TestCase.getWaitingTests(limit).then(function (waitingTests) {
                testRunner.run(waitingTests);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }).catch(function(error) {
        console.log(error);
    });
    models.Job.getRunningJobs().then(function (jobs) {
        for (index = 0; index < jobs.length; index++) {
            if (jobs[index].TestCases && jobs[index].TestCases.length == 0) {
                jobs[index].status = "COMPLETED";
                jobs[index].save().then(function (data) { }).catch(function (err) { });
            }
        }
    }).catch(function (error) {
        console.log(error);
    });
    
    dbHelper.resetExpiredVMs();
}
scheduledTask();

var run = function () {
    // define task that runs every 20s
    var task = new cron('*/20 * * * * *', function () {
        scheduledTask();
    }, false);

    task.start();
};

var cleanUp = function () {

}
setUp();
run();

