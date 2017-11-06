"use strict";

module.exports = function(sequelize, DataTypes) {
    var SnapShot = sequelize.define('SnapShot', {
        name: {
            type: DataTypes.STRING
        },
        appName: {
            type: DataTypes.STRING,
        },
        active: {
            type: DataTypes.BOOLEAN,
            field: "active",
            defaultValue: true
        }
    }, {
        classMethods: {
            associate: function(models) {
                SnapShot.belongsTo(models.VM, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            },
            delete: function(id) {
                return SnapShot.destroy({
                    where: {
                        id: id
                    }
                })
            },
            add: function(snapshot) {
                return SnapShot.create({
                    name: snapshot.name,
                    appName: snapshot.appName,
                    active: snapshot.active,
                    VMId: snapshot.VMId
                });
            },
            update: function(snapshot) {
                SnapShot.update({
                    name: snapshot.name,
                    appName: snapshot.appName,
                    active: snapshot.active,
                    VMId: snapshot.VMId
                }, {
                    where: {
                        id: snapshot.id
                    }
                })
            }
        }
    }, {
        timestamps: false
    }, {
        schema: 'dbo'
    });
    return SnapShot;
};