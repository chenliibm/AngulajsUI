"use strict";

var router = require('express').Router();
var path = require('path');
var models = require('../database');
var perlHelper = require('../utils/perlHelper');
var config = require('../config');

var JOB_STATUS = {};
JOB_STATUS.RUNNING = "RUNNING";
JOB_STATUS.WAITING = "WAITING";
JOB_STATUS.CREATED = "CREATED";
JOB_STATUS.COMPLETE = "COMPLETE";

router.get('/', function (req, res) {
    models.Job.getRunningJobs().then(function(data) {
        res.json({data: data});
    }).catch(function(data) {
        res.json({data: data})
       // console.log(data);
    });
   // res.json({ message: 'Get Job Related APIs' });
});

router.get('/all', function (req, res) {
    models.Job.findAll().then(function (data) {
        res.json({ status: 'success', data: data });
        res.status(200);
    }).catch(function (data) {
        res.json({ status: 'fail', 'message': 'Internal Server Error' });
        res.status(500);
    });
});

router.post('/review', function (req, res) {
    var jobs = req.body.jobs;
    var removeURLStructure = req.body.removeURLStructure;

    //get test environments from bde
    perlHelper.getTestEnvironments(jobs.split(","), config.bde.username, config.bde.password, config.bde.site, config.bde.name).
        then(function (envs) {   // envs comes in {fixletID:[testAutoEnvArray]}
            var validEnvs = {};
            for (var key in envs) { // filter away Fixlets without testAutoEnv
                if(envs[key].length > 0) {
                    validEnvs[key] = envs[key];
                } else {
                    console.log("Dropped Fixlet " + key);
                }
            }

            if(validEnvs.length == 0) {
                console.log("Error: No valid testAutoEnv found.");
                res.status(200).json({ status: 'fail', message: "No valid testAutoEnv found." });
                return;
            }

            var job = models.Job.build({
                jobType: "FIXLET",
                jobs: jobs,
                bdeDSN: config.bde.name,
                bdeSiteName: config.bde.site,
                esxServer: config.esx.api,
                esxUser: config.esx.username,
                esxPassword: config.esx.password,
                removeURLStructure: removeURLStructure,
                vmSafetyOff: req.body.vmSafetyOff,
                status: JOB_STATUS.RUNNING
            });

            var testcases = [];
            for (var key in validEnvs) { // Looping through every Fixlet

                for (var index in validEnvs[key]) { // Visit each testAutoEnv of this Fixlet
                    var testcase = validEnvs[key][index];
                    console.log(testcase);
                    var osName = testcase.split('&&')[0];
                    var appName = testcase.split('&&')[1];;
                    if (osName) {
                        osName = osName.trim();
                    }
                    if (appName) {
                        appName = appName.trim();
                    }
                    var tempTestCase = models.TestCase.build({
                        fixletID: key,
                        testCaseName: testcase,
                        'osName': osName,
                        'appName': appName,
                        status: JOB_STATUS.WAITING
                    });
                    testcases.push(tempTestCase);
                }
            }
            res.status(200).json({ status: 'success', data: { job: job, testcases: testcases } })
        }).catch(function (err) {
            res.status(500).json({ status: 'fail', message: err });
        });
});

/**
 * Create and Run the job with the testcases in post request
 */
router.post('/', function (req, res) {
    var jobs = req.body.jobs;
    var removeURLStructure = req.body.removeURLStructure;

    //get test environments from bde
    var job = models.Job.build({
        jobType: "FIXLET",
        jobs: jobs,
        bdeDSN: config.bde.name,
        bdeSiteName: config.bde.site,
        esxServer: config.esx.api,
        esxUser: config.esx.username,
        esxPassword: config.esx.password,
        removeURLStructure: removeURLStructure,
        vmSafetyOff: req.body.vmSafetyOff,
        status: JOB_STATUS.RUNNING
    });

    var testcases = [];
    for (var i=0; i <  req.body.testcases.length; i++) {
        var testcase = req.body.testcases[i];
        testcase.status = JOB_STATUS.WAITING;
        console.log(testcase);
        var tempTestCase = models.TestCase.build(testcase);
        testcases.push(tempTestCase);
    }

    job.save().then(function (savedJob) {
        for (var i = 0; i < testcases.length; i++) {
            testcases[i].save().then(function (saved) {
                savedJob.setTestCases(saved);
            }).catch(function (err) {
                console.log(err);
            });
        }
        res.json({ status: 'success', job: job });
    }).catch(function (err) {
        res.json({status: 'fail', message: err });
    });
});

/**
 * Automatically create and run the job without inputting testcases
 */
router.post('/auto', function (req, res) {

    var jobs = req.body.jobs;
    console.log(jobs.split(","));

    // Get testcases from bde using perl helper
    perlHelper.getTestEnvironments(jobs.split(","), config.bde.username, config.bde.password, config.bde.site, config.bde.name).
        then(function (envs) {   // envs comes in {fixletID:[testAutoEnvArray]}
            console.log(envs);
            var job = models.Job.build({
                jobType: "FIXLET",
                jobs: jobs,
                bdeDSN: config.bde.name,
                bdeSiteName: config.bde.site,
                esxServer: config.esx.api,
                esxUser: config.esx.username,
                esxPassword: config.esx.password,
                removeURLStructure: req.body.removeURLStructure,
                vmSafetyOff: req.body.vmSafetyOff,
                status: JOB_STATUS.RUNNING
            });

            var testcases = [];
            for (var key in envs) {
                for (var index in envs[key]) {
                    console.log(envs[key])
                    var testcase = envs[key][index];
                    console.log(testcase);
                    var osName = testcase.split('&&')[0];
                    var appName = testcase.split('&&')[1];;
                    if (osName) {
                        osName = osName.trim();
                    }
                    if (appName) {
                        appName = appName.trim();
                    }
                    var tempTestCase = models.TestCase.build({
                        fixletID: key,
                        testCaseName: testcase,
                        'osName': osName,
                        'appName': appName,
                        status: JOB_STATUS.WAITING
                    });
                    testcases.push(tempTestCase);
                }
            }

            job.save().then(function (job) {
                for (var i = 0; i < testcases.length; i++) {
                    testcases[i].save().then(function (testcase) {
                        job.setTestCases(testcase);
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
                res.json({ status: 'success', job: job });
            }).catch(function (err) {
                res.json({ status: 'fail', message: err });
            });

        });
});
router.post('/run', function (req, res) {
    var data = req.body;
    var jobID = req.body.id;

    var job = models.Job.findOne(
        {
            where: { id: jobID }
        }
    ).then(function (job) {
        job.status = JOB_STATUS.RUNNING;
        job.getTestCases().then(function (testcases) {
            console.log(testcases);

            for (var index = 0; index < testcases.length; index++) {
                var testcase = testcases[index];
                testcase.status = JOB_STATUS.WAITING;
                testcase.save().then(function (testcase) {

                }).catch(function (err) {
                    console.log(err);
                })
            }
            job.save().then(function (job) {
                console.log(job);
                res.status(200);
                res.json({ 'status': 'success', 'message': 'job run successfully' });
            }).catch(function (err) {
                console.log(job);
                res.status(500);
                res.json({ 'status': 'fail', 'message': 'Internal Server Error' })
            })

        }).catch(function (err) {
            console.log(err);
        })
    }).catch(function (err) {
        console.log(err);
    })
})
module.exports = router;