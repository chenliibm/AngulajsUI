app.controller('testcasesCtrl', function ($scope, $http, Job, $routeParams, $uibModal, $location) {
  $('.nav-tabs a[href="#testcases"]').tab('show');
   $scope.detailJob = [];
  $scope.selectedJobid = Job.id|$routeParams.id;
  $scope.dicFailID = [];
  // $scope.checkAllkey = false;
 //GET testcase
 $http({
      method : "GET",
      url : "/api/testcase/job/" + $scope.selectedJobid
    }).then(function mySucces(response) {
        $scope.detailJob = response.data["data"];
      }, function myError(response) {
        console.log(response.statusText);
    });

 $scope.killcase = function(testcaseid){
  $scope.killornot="";

  console.log(testcaseid);

  $http({
      method : "POST",
      data : { "testcaseID": testcaseid},
      url : "/api/testcase/Kill" 
    }).then(function mySucces(response) {
     console.log(response.status);
        console.log(response.data);
//update detailJob if response.status success
$scope.killornot=response.data;


      }, function myError(response) {
        console.log(response.statusText);
        $scope.killornot=response.data["message"];
    });

 };





//***********************

  // $scope.user = {
  //   roles: []
  // };

  $scope.checkAll = function() {
    // $scope.user.roles = angular.copy($scope.roles);
    $scope.dicFailID = angular.copy($scope.detailJob);
  };
  $scope.uncheckAll = function() {
    $scope.dicFailID = [];
  };

    $scope.checkToggle = function(){
console.log($scope.checkAllkey);
if ($scope.checkAllkey) {

  $scope.checkAll();
}else {

  $scope.uncheckAll();
}

  };
 

//***************


$scope.resubmitTest = function(){

if ($scope.dicFailID.length == 0) {
  console.log("no job resubmitted");
  return;
}
console.log($scope.dicFailID);
var ResmtJob = {}; 
ResmtJob["testcases"] = [];
ResmtJob["jobs"] = [];
// ResmtJob["removeURLStructure"] = false;
ResmtJob["removeURLStructure"] = $scope.dicFailID[0].Job.removeURLStructure;


for (var i=0; i < $scope.dicFailID.length; i++){
  var testcase = {};
  testcase["id"] = null;
  testcase["fixletID"] = $scope.dicFailID[i].fixletID;
  testcase["testCaseName"] = $scope.dicFailID[i].testCaseName;
  testcase["osName"] = $scope.dicFailID[i].osName;
  testcase["appName"] = $scope.dicFailID[i].appName;
  testcase["status"] = "CREATED";
  ResmtJob["testcases"].push(testcase);
  ResmtJob["jobs"].push($scope.dicFailID[i].fixletID);
}

 ResmtJob["jobs"]=Array.from(new Set(ResmtJob["jobs"])).join();
  //console.log(JSON.stringify(ResmtJob));

  $http({
      method : "POST",
      data : JSON.stringify(ResmtJob),
      url : "/api/job"
    }).then(function mySucces(response) {
        console.log(response.data["status"]);
      }, function myError(response) {
        console.log(response.statusText);
    });

 $location.path("/jobs");

};

$scope.singleFail = function(failTest){

  
  var singleTest = {};
  singleTest["testcases"] = [{}];
  singleTest.testcases[0]["id"] = null;
  singleTest.testcases[0]["fixletID"] = failTest.fixletID;
  singleTest.testcases[0]["testCaseName"] = failTest.testCaseName;
  singleTest.testcases[0]["osName"] = failTest.osName;
  singleTest.testcases[0]["appName"] = failTest.appName;
  singleTest.testcases[0]["status"] = "Created";
  singleTest["jobs"] = failTest.fixletID;
  // singleTest["removeURLStructure"] = false;
  singleTest["removeURLStructure"] = failTest.Job.removeURLStructure;

  // console.log(JSON.stringify(singleTest));
  var jsonInput = JSON.stringify(singleTest);

  $http({
      method : "POST",
      data : jsonInput,
      url : "/api/job"
    }).then(function mySucces(response) {
        console.log(response.data["status"]);
      }, function myError(response) {
        console.log(response.statusText);
    });

  $location.path("/jobs");

};

 // $scope.testf  = function (testcaseid){
 //  console.log(testcaseid);

 // };
 

$scope.logTextArea = false;
$scope.displayN = "none";
 $scope.getLog = function(testcaseid){
  $http({
    method : "GET", 
    url  : "/api/testcase/" + testcaseid +"/log"
  }).then(function mySuccess(response){
    console.log(response.data);
    $scope.loginfo = response.data["data"];
    $scope.logstatus = response.data["status"]
    $scope.logTextArea = true; 
    $scope.displayN = "block";
  }, function myErro(response){
    console.log(response.sstatusText);
  });

 };
$scope.closeLog = function () {
$scope.logTextArea =false; 
$scope.displayN = "none";
};
$scope.showLog= function(testcase) {
  $uibModal.open({
            templateUrl: 'templates/testcases.log.modal.html',
            controller: 'logController',
            resolve: {
              testcase: function(){ 
                return testcase;
              }
            },
            size: 'lg'
        });
        return false;
}

});