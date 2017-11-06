"use strict";

var config = {};

config.db = {};
config.db.username = 'sa';
config.db.password = 'p@ssw0rd';
config.db.host = 'localhost';
config.db.database = 'AutomationResults';
config.db.dialect = 'mssql';
config.db.dialectOptions = {};
config.db.dialectOptions.instanceName = 'SQLEXPRESS';
config.httpPort = 8080;
config.httpHost = "0.0.0.0";
config.httpsPort = 8443;
/*
config.sslKey = "conf/oneup.key";
config.sslCert = "conf/oneup.crt";
config.logDir = "logs";

config.secret = require('crypto').randomBytes(64).toString('base64');*/
module.exports = config;

config.esx = {};
config.esx.username = "roysoum";
config.esx.password = "password";
config.esx.api = "https://10.1.4.100:443/sdk";

config.bde = {};
config.bde.username = "shwesc";
config.bde.password = "p@ssw0rd";
config.bde.name = "bde_testdb";
config.bde.site = "EnterpriseSecurity";

config.resultFolderPath = "C:\\resultFolder";
config.ssh = "C:\\Users\\Administrator\\.ssh\\id_rsa";

config.parallelLimit = 5;
config.expiryTime = 2; //in minute