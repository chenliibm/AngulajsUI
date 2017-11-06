module.exports = function(sequelize, DataTypes) {
    var TestCase = sequelize.define('TestCase', {
        fixletID: {
            type: DataTypes.STRING,
            field: 'FIXLET_ID'
        },
        testCaseName: {
            type: DataTypes.STRING,
            field: 'TEST_CASE_NAME'
        },
        osName: {
            type: DataTypes.STRING,
            field: 'OS_NAME'
        },
        appName: {
            type: DataTypes.STRING,
            field: 'APP_NAME'
        },
        assignedVMName: {
            type: DataTypes.STRING,
            field: 'ASSIGNED_VM_NAME'
        },
        assignedVMSnapshot: {
            type: DataTypes.STRING,
            field: 'ASSIGNED_VM_SNAPSHOT'
        },
        assignedVMIP: {
            type: DataTypes.STRING,
            field: 'ASSIGNED_VM_IP'
        },
        assignedVM: {
            type: DataTypes.STRING,
            field: 'ASSIGNED_VM'
        },
        status: {
            type: DataTypes.STRING,
            field: 'STATUS',
            defaultValue: "CREATED"
        },
        pid: {
            type: DataTypes.STRING,
            field: 'PID',
        },
        log: {
            type: DataTypes.STRING,
            field: 'LOG'
        }
    }, {
        classMethods: {
            associate: function(models) {
                TestCase.belongsTo(models.Job);
            },
            getWaitingTests: function(limit) {
                console.log(limit);
                var testcases = TestCase.findAll({
                   where: {
                       status: {$like: "WAITING"}
                   },
                   limit: limit
                });
                return testcases;
            },
            getRunningTests: function() {
                var testcases = TestCase.findAll({
                   where: {
                       status: {$like: "RUNNING"}
                   }
                });
                return testcases;
            }
        }
    }, {
        timestamps: false
    }, {
        schema:'dbo'
    });
    
    return TestCase;
};