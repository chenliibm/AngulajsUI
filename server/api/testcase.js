"use strict";

var router = require('express').Router();
var path = require('path');
var models = require('../database');
var perlHelper = require('../utils/perlHelper');
var testRunner = require('../utils/testRunner');
var config = require('../config');
router.get('/', function (req, res) {
    res.json({ message: "Get Testcase related APIS" });
});

/**
 * not implemented yet to get all testcases
 */
router.get('/all', function (req, res) {
    res.json({ status: 'success', message: "Not Yet implemented" })
});

router.get('/job/:jobID', function (req, res) {
    var data = req.body;
    var jobID = req.params.jobID;
    console.log(jobID);
    models.TestCase.findAll({
        include: [
            { model: models.Job, required: true, where: { id: jobID } }
        ]
    }).then(function (data) {
        res.status(200).json({ status: 'success', data: data })
    }).catch(function (data) {
        console.log(data);
        res.json({ status: 'fail', message: 'Internal Server Error' });
        res.status(500);
    });
})

router.post('/kill', function (req, res) {
    var data = req.body;
    var testcaseID = data.testcaseID;
    models.TestCase.findOne({
        where: { id: testcaseID }
    }).then(function (data) {
        console.log(data.pid);
        if (data.pid) {
            var pid = data.pid;
            testRunner.kill(pid);
            res.status(200).json({ 'status': 'success', message: 'Killed' })
        }
        if (data.status == "WAITING"){
            data.status = "FAILED";
            data.save() .catch(error => {console.log(error);});
            res.status(200).json({'status' : 'success', message: 'Abort'});

        }

        res.status(500).json({ 'status': 'fail', message: 'Killing failed' })
    });

});

router.get('/:testcaseID/log', function (req, res) {

    var testcaseID = req.params.testcaseID;
    console.log(testcaseID);
    models.TestCase.findOne({
        where: { id: testcaseID }
    }).then(function (data) {
        const fs = require('fs');
        fs.readFile(data.log, 'utf-8', (err, content) => {
            if(!err) {
                res.status(200).json({ 'status': 'success', data: content });
            }else {
                 var backupLog = config.resultFolderPath + "\\" + data.JobId + "\\{" + data.osName + "}_Automation.log";
                 console.log(backupLog);
                 fs.readFile(backupLog, 'utf-8', (err, content) => {
                    if(!err) {
                         res.status(200).json({ 'status': 'success', data: content });
                    }else {
                        console.log(err);
                        res.status(500).json({ 'status': 'fail', message: 'Error Opening File' });
                    }
                 });
                 }
        });
    }).catch(function (error) {
        console.log(error);

        res.status(500).json({ 'status': 'fail', message: 'Internal Server Error' });
    })
   // res.status(200).json({'status': 'success', message: 'log will come later'});
    
})
module.exports = router;