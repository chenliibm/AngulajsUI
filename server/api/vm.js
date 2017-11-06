"use strict";

var router = require('express').Router();
var path = require('path');
var models = require('../database');
var perlHelper = require('../utils/perlHelper');
router.get('/', function (req, res) {
    res.json({ message: 'Get VM Related APIs' });
});

router.get('/all', function (req, res) {
    models.VM.findAll({
        include: {model: models.SnapShot, as: 'SnapShots'}
    }).then(function (data) {
        res.json({ status: 'success', data: data });
        res.status(200);
    }).catch(function (data) {
        res.json({ message: 'Internal Server Error' });
        res.status(500);
    });
});

router.post('/', function (req, res) {
    var data = req.body;
    var vm = models.VM.build({
        name: data.name,
        osName: data.osName,
    });

    var snapshot = models.SnapShot.build({
        name: data.snapshotName,
        appName: data.appName,
    });
    vm.save().then(function(vm) {
        snapshot.save().then(function(snapshot) {
            vm.setSnapShots(snapshot);
        })
        res.status(200);
        res.json({status: 'success', data : vm});
    }).catch(function(err) {
        console.log(err);
        res.status(500);
        res.json({status: 'fail', message: err})
    })

});

router.put('/snapshot/update', function(req,res) {
    var data = req.body;
    var snapshot = data.snapshot;
    models.SnapShot.update(snapshot).then(function(snapshot) {
        res.status(200);
        res.json({status: 'success', data: snapshot})
    }).catch(function(err) {
        res.json(500);
        res.json({status: 'fail', message: err});
    })
})
router.delete('/snapshot/:id', function(req,res) {
    var id = req.params.id;
    models.SnapShot.delete(id).then(function(snapshot) {
        res.status(200);
        res.json({status: 'success', message: 'removed'});
    }).catch(function(err) {
        res.json(500);
        res.json({status: 'fail', message: err})
    })
})
/*
router.put('/', function (req, res) {
    var data = req.body;
    var vmID = req.body.id;

    models.VM.findOne(
        {
            where: {
                id: vmID,
            },
            include: {model: models.SnapShot, as: 'SnapShots'}
        })
        .then(function (vm) {
            vm.name = req.body.name;
            vm.osName = req.body.osName;
            vm.occupied = req.body.occupied;
            res.status(200);
        }).catch(function (err) {
            console.log(err);
            res.status(500);
        })
});*/
module.exports = router;