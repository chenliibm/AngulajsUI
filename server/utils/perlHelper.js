var models = require('../database');
var config = require('../config');
var fs = require('fs');
perlHelper =
	{
		getTestEnvironments: function (fixlets, user, password, siteName, bde) {

			var fixletString = "";
			for (index = 0; index < fixlets.length; index++) {
				fixletString = fixletString + " " + fixlets[index];
			}

			var thisPromise = new Promise(
				function (resolve, reject) {

					commandLine = 'C:\\TEMAutomation\\bdeHelper -o 1 ' +
						' -s "' + siteName +
						'" -f ' + fixletString +
						' -u ' + user +
						' -p ' + password +
						' -d ' + bde;
					/*
	commandLine = 	'perl C:\\TEMAutomation\\bdeHelper.pl -o 1 -s "'+
					siteName + '"  -f ' +
					fixletString + ' -u ' + 
					user + ' -p ' + 
					password + ' -d bde_testdb' ;*/

					console.log(commandLine);
					var spawn = require('child_process').exec;
					const child = spawn(commandLine, {
						cwd: 'C:\\TEMAutomation',
						detached: false
					});


					child.stdout.on('data', (data) => {
						console.log(JSON.parse(data));
						resolve(JSON.parse(data));
					});
					child.stderr.on('data', (data) => {
						console.log(data);
						resolve(data);
					});
				});

			return thisPromise;
		},
		runTestCase: function (testcase, vm) {
			console.log('running' + JSON.stringify(testcase));
			var path = config.resultFolderPath + "\\" + testcase.JobId;
			if(!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
			//perl runTestCase.pl 12078131 "Windows 7 SP1 x64" "NA" "Windows 7 Gold x64 English #1 (with IE)" "NA" "C:" "bde_testdb" "EnterpriseSecurity" roysoum password "https://10.1.4.100:443/sdk" "shwesc" "p@ssw0rd" true 1 true
			var thisPromise = new Promise(
				function (resolve, reject) {
					var commandLine = 'perl C:\\TEMAutomation\\runTestCase.pl ' + testcase.fixletID + ' "' + testcase.osName + '" "' +
						testcase.appName + '" "' + vm.name + '" "' + vm.SnapShots[0].name + '" "' +
						path + '" "' +
						config.bde.name + '" "' + config.bde.site + '" "' + config.esx.username + '" "' + config.esx.password + '" "' +
						config.esx.api + '" "' + config.bde.username + '" "' + config.bde.password + '" ' +
						"true 1 true";

					console.log(commandLine);

					var spawn = require('child_process').spawn;
					const child = spawn(commandLine, {
						stdio: 'inherit',
						cwd: "C:\\TEMAutomation",
						shell: true,
						detached: false
					});
					testcase.pid = child.pid;
					testcase.log = path + "\\" + testcase.fixletID + "_"+ vm.name + "_" +  vm.SnapShots[0].name+".log";
					testcase.save().catch(function(err) {
						console.log('cant save pid');
					});
					child.on('error', function (err) {
						testcase.status = "ERROR";
						testcase.save().then(function (data) {
								
							models.Job.getRunningJobs().then(function(jobs) {
								for(index = 0; index < jobs.length; index++) {
									if(jobs[index].TestCases && jobs[index].TestCases.length == 0) {
										jobs[index].status = "COMPLETED";
										jobs[index].save().then(function(data) {}).catch(function(err){});
									}
								}
							}).catch(function(error) {
								console.log(error);
							});
						}).catch(function (err) {
							console.log(err);
						})
						
						vm.occupied = false;
						vm.save().catch(function (err) {
							console.log(err);
						})
						console.log(err.toString());
					});

					// update the status of testcase and vm after running
					child.on('exit', function (code) {
						
						console.log(code);
						if(code == 2) {	
							testcase.status = "PASSED";
						} else {
							testcase.status = "FAILED";
							var backupLog = config.resultFolderPath + "\\" + testcase.JobId + "\\{" + testcase.osName + "}_Automation.log";
							try {
								content = fs.readFileSync(backupLog, 'utf-8');
								var re = /VM Snapshot .* not found/;
								if(re.exec(content)) {
									vm.SnapShots[0].active = false;
									vm.SnapShots[0].save();
								}	
							}catch(error) {

							}
						}
						testcase.pid = "";
						testcase.save().then(function() {	
							models.Job.getRunningJobs().then(function(jobs) {
								for(index = 0; index < jobs.length; index++) {
									if(jobs[index].TestCases && jobs[index].TestCases.length == 0) {
										jobs[index].status = "COMPLETED";
										jobs[index].save().then(function(data) {}).catch(function(err){});
									}
								}
							}).catch(function(error) {
								console.log(error);
							});
						}).catch(function (err) {
							console.log(err);
						});

						vm.occupied = false;
						vm.save().catch(function (err) {
							console.log(err);
						})

					})
					resolve('success');
				}
			);
			return thisPromise;
		},
	}
/*
console.log( process.env.PATH )
perlHelper.runFixletTester({"fixletID": '313397703'},"10.1.242.195" ).then(function(data) {
	console.log(data);
}).catch(function(err) {
	console.log(err);
})*/
/*
getTestEnvironments([97763201,12078133,12078131,1234], 'shwesc', 'p@ssw0rd', 'EnterpriseSecurity', 'bde_testdb').
	then(function(data) {
		console.log(data);
	});
*/

module.exports = perlHelper;