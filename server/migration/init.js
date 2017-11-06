const sequelize_fixtures = require('sequelize-fixtures');

const models = require('../database');

sequelize_fixtures.loadFile('converted.json', models).then(function() {

});