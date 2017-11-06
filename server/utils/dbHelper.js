var models = require('../database');

dbHelper = {

    resetExpiredVMs: function () {
        console.log('Cleaning Expired VMs');
        var query = {};
        // Select Vms whose expiry date is less than current time and is occupied
        // query.where = {
        //     'occupied': true,
        //     'EXPIRY_TIME': {
        //         $ne :null,
        //         $lt: new Date()
        //     }

        // };
        models.VM.findAll({
            // query
           where: {
                    'occupied': true,
                    'EXPIRY_TIME': {
                        $ne :null,
                        $lt: new Date()
                    }
                  }
        }).then(function (vms) {
            for (var i = 0; i < vms.length; i++) {
                vms[i].occupied = false;
                vms[i].expiryTime = null;
                vms[i].save().catch(function (err) {
                    console.log(err);
                });
            }
        }).catch(function (err) {

        })
    },
    /**
     * Update the occupied status of all the VMs to false
     */
    resetVMTable: function () {
        console.log('Reseting Occupied VMs')
        models.VM.findAll({
            where: {
                'occupied': true
            }
        }).then(function (vms) {
            for (var i = 0; i < vms.length; i++) {
                console.log(vms[i]);
                vms[i].occupied = false;
                vms[i].save().then(function (data) {

                }).catch(function (err) {
                    console.log('can\'t update status', err);
                })
            }

        }).catch(function (err) {
            console.log("Error in finding VMs ", err);
        })
    },
    /**
     * Update the status of all the testcases that are in Running state to WAITING
     */
    resetTestCaseTable: function () {
        console.log('Reseting Testcases');
        models.TestCase.findAll({
            where: {
                status: 'RUNNING'
            }
        }).then(function (testcases) {
            console.log(testcases);
            for (var i = 0; i < testcases.length; i++) {
                testcases[i].status = "FAILED; SERVER SHUTDOWN";
                testcases[i].save().then(function (data) {

                }).catch(function (err) {
                    console.log("Can't update status", err);
                })
            }
        })
    },
}
module.exports = dbHelper;