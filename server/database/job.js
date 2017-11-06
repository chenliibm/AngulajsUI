module.exports = function(sequelize, DataTypes) { 
    var Job = sequelize.define('Job', {
        jobType: {
            type: DataTypes.STRING,
            field: 'JOB_TYPE'
        },
        jobs: {
            type: DataTypes.STRING(1000),
            field: 'JOBS'
        },
        bdeDSN: {
            type: DataTypes.STRING,
            field: 'BDE_DSN',
        },
        bdeSiteName: {
            type: DataTypes.STRING,
            field: 'BDE_SITE_NAME'
        },
        esxServer: {
            type: DataTypes.STRING,
            field: 'ESX_SERVER',
        },
        esxUser: {
            type: DataTypes.STRING,
            field: 'ESX_USER',
        },
        esxPassword: {
            type: DataTypes.STRING,
            field: 'ESX_PASSWORD',
        },
        removeURLStructure: {
            type: DataTypes.BOOLEAN,
            field: 'REMOVE_URL_STRUCTURE'
        },
        vmSafetyOff: {
            type: DataTypes.BOOLEAN,
            field: 'vmsafety_off'
        },
        status: {
            type: DataTypes.STRING,
            field: 'STATUS'
        }
    }, {
        classMethods: {
            associate: function(models) {
                Job.hasMany(models.TestCase, {as: 'TestCases'});
            },
            getRunningJobs: function(models) {
                return Job.findAll({
                    include: [{
                        model: sequelize.models.TestCase,
                        as: "TestCases",
                        required: false,
                        where: {$or: [{status: "RUNNING"}, {status:"WAITING"}]}
                    }],
                    where: {status: "RUNNING"}
                })
            }
        }
    }, {
        timestamps: false
    }, {
        schema:'dbo'
    });

    return Job;
};
