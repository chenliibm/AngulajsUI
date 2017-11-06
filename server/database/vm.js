"use strict";


module.exports = function(sequelize, DataTypes) {
    var VM = sequelize.define('VM', {
        name: {
            type: DataTypes.STRING,
            field: 'NAME'
        },
        osName: {
            type: DataTypes.STRING,
            field: 'OS_NAME'
        },
        active: {
            type: DataTypes.BOOLEAN,
            field: 'ACTIVE',
            defaultValue: 'TRUE'
        },
        occupied: {
            type: DataTypes.BOOLEAN,
            field: 'OCCUPIED',
            defaultValue: 'FALSE',
        },
        occupiedBy: {   // testcaseID
            type: DataTypes.STRING,
            field: "OCCUPIED_BY"
        },
        expiryTime: {
            type: DataTypes.DATE,
            field: 'EXPIRY_TIME',
        }
    }, {
        classMethods: {
            associate: function(models) {
                VM.hasMany(models.SnapShot, {as: 'SnapShots'});
            },
            getAvailableVM: function(osName, appName) {
                // if the fixlet only tests for os
                if(osName && !appName) {
                    return VM.findAll({
                        include: [{
                            model: sequelize.models.SnapShot,
                            as: 'SnapShots',
                            where: {active: true}
                        }],
                        where: {
                         $and: [{osName: osName}]

                        },
                        limit: 10
                    });
                }

                if(!osName && appName) {
                    return VM.findAll({
                        include: [{
                            model: sequelize.models.SnapShot,
                            as: 'Snapshots',
                            where: { $and: [ {appName: appName}, {active: true}]}
                        }],
                        limit: 10
                    })
                }
                return VM.findAll({
                    include: [{
                        model: sequelize.models.SnapShot,
                        as:'SnapShots',
                        where: {$and: [ {appName: appName}, {active: true}] } 
                    }],
                    where: {
                            $and: 
                            [   {osName: osName}
                            ]
                    },
                    limit: 10
                })
            },
            freeVM: function(name) {
                return VM.update(
                    {occupied: false},
                    {where: {name: name}}
                );
            },
            freeExpiredVMs: function() {

            },
        }
    }, {
        timestamps: false
    }, {
        schema: 'dbo'
    });

    return VM;
};