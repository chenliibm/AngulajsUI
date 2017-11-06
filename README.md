# Test-automation-server

This is the test automation server for winpatch contents.  The server will be able to accept test jobs through the API as well as the front end web page.  User will be able to monitor the status of the test cases and add/edit new VMs.

## Setting up for Development

### The system should have the following environments installed.

- BDE(ODBC) installed. The instructions to install BDE can be foundP
[here](https://w3-connections.ibm.com/wikis/home?lang=en-us#!/wiki/Wbf2e76a19de9_45f4_9c6b_5d879b9a002b/page/BDE%20%28BigFix%20Development%20Environment%29 "Setting up BDE")
- Strawberry perl development environment with BigFix Libraries installed
- Install [Node](https://nodejs.org/en/ "Node")

### Steps to set up the development environment

- clone this repository in C:\ directory (must be exact)
- Install Bower by running this cmd
```
$ npm install -g bower
```
- Install Grunt by running this cmd
```
$ npm install -g grunt
```
- Install the bower dependencies and npm dependencies in /ui folder
```
$ bower install
$ npm install
```
- Install the npm dependencies in /server Folder
```
$ npm install
```
- Install SQL Server and setup with the following defaults. Recommended version: SQL Server 2016 Express
```
config.db.username = 'sa';
config.db.password = 'p@ssw0rd';
config.db.database = 'AutomationResults';
config.db.dialectOptions.instanceName = 'SQLEXPRESS';
```
- Create a Database named "AutomationResults"
- In SQL Server Configuration Manager, enable "SQL Server Browser" service and TCP/IP protocol
- Run migration of data from /server/migration folder
```
$ node init.js
```
- Setup Perl scripts by checking out [winpatch-automation-backend](https://github.ibm.com/bigfixsg/winpatch-automation-backend) at C:\TMAutomation folder
- Run Server in /server folder
```
$ up.bat
```