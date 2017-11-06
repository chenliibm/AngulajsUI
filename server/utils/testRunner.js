var models = require('../database');
var _ = require('underscore');
var perlHelper = require('../utils/perlHelper');
var moment = require('moment');
var asyncLoop = require('node-async-loop');
var config = require('../config');
// Helps with running the test case
var TestRunner = {
    _run: function (testcase) {
        var test = testcase;
        return new Promise(function(resolve, reject) {
            models.VM.getAvailableVM(test.osName, test.appName).then(function (vms) {

            // No Match was found
            if (!vms || vms.length <= 0) {
                console.log("No Matching VM");
                test.status = "NO MATCHING VM";
                test.save().then(function (data) {
                }).catch(function (error) {
                    console.log(error);
                })
                return;
            }

            // Loop through matching vms and run thes test on an unoccupied vm
            for (var index = 0; index < vms.length; index++) {
                vm = vms[index];
                if (vm.occupied == false) {
                    // Change VM status to occupied
                    vm.occupied = true;
                    vm.save().then(function (data) {
                        console.log("VM Status changed");
                        //console.log(data);
                    }).catch(function (error) {
                        console.log(error);
                    })

                    // Change Test Case status to running
                    console.log(vm.get({ plain: true }));
                    test.status = "RUNNING";
                    test.assignedVMName = vm.name;
                    test.assignedVMSnapshot = vm.SnapShots[0].name;
                    test.save().then(function (data) {
                        console.log("Changing the testcase status");
                    }).catch(function (error) {
                        console.log(error);
                    });

                    
                    vm.occupiedBy = test.id;
                    var expiryTime = moment().add(config.expiryTime, "minutes").format("YYYY-MM-DD hh:mm:ss");
                    console.log(expiryTime);
                    vm.expiryTime =expiryTime;
                    vm.save().then(function (data) {
                        console.log("VM Status changed",JSON.stringify(data));
                    }).catch(function (error) {
                        console.log(error);
                    })

                    //run test case
                    perlHelper.runTestCase(test, vm).then(function (data) {
                        console.log('Test case run successfully');
                        console.log(data);
                    }).catch(function (data) {
                        console.log('Testcase Run Error');
                        console.log(data);
                    });
                    resolve();
                    return;
                } else {
                    //do nothing
                }
            }
            return;
        }).catch(function (err) {
            console.log('Error in getting available VMS');
            console.log(err);
            resolve();
        })
        })
        
    },
    run: function (waitingTests) {
        _run = this._run;
        asyncLoop(waitingTests, function (test, next) {
            _run(test).then(function () {
                next();
            }).catch(function () {
                next();
            });
        }, function (err) {
            if (err) {
                console.error('Error: ' + err.message);
                return;
            }

        });
    },

    kill: function (pid, callback) {

        var psTree = require('ps-tree');
        var kill = require('tree-kill');
        kill(pid);

    }
}
module.exports = TestRunner;