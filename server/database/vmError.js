"use strict";


module.exports = function(sequelize, DataTypes) {
    var vmError = sequelize.define('vmError', {
        name: {
            type: DataTypes.STRING,
            field: 'NAME'
        },
        osName: {
            type: DataTypes.STRING,
            field: 'OS_NAME'
        },
        error: {
            type: DataTypes.STRING,
            field: 'ERROR'
        },
        active: {
            type: DataTypes.STRING,
            field: "active",
            defaultValue: true
        },
    }, {
        classMethods: {
            associate: function(models) {
                // VM.hasMany(models.SnapShot, {as: 'SnapShots'});
            },
        }
    }, {
        timestamps: false
    }, {
        schema: 'dbo'
    });

    return vmError;
};