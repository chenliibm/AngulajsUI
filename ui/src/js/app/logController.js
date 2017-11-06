app.controller('logController', function ($scope, $http, $route,$timeout,testcase) {
	
	// $scope.fixletids = "";
	// $scope.fixletids_confirm=[];
	$scope.id = testcase.fixletID;
    $scope.vm = testcase.assignedVMName;
    $scope.snapshot = testcase.assignedVMSnapshot;
    $scope.logInfo = "Fetching Log";
    $http({
        method: "GET",
        url : "/api/testcase/" + testcase.id + "/log"
    }). then(function success(response) {
        $scope.logInfo = response.data["data"];
    }, function error(response) {
        $scope.logInfo = response;
    })
    // $http({
    //      method : "GET", 
    //      url  : "/api/testcase/" + 100 +"/log"
    // }).then(function success(response) {
    //     $scope.logInfo = response.data["data"];
    // }, function error(response) {
    //     $scope.logInfo = response;
    // })
    // $scope.delRow = function(ind){

    // 	if ( ind >-1){
    // 		$scope.fixletids_confirm.splice(ind,1); 
    // 	}
    // };

	// $scope.submit = function() {
	// 	//$scope.fixletids="yes";
	// 	console.log($scope.fixletids);
	// 	var postdata={};
	// 	postdata['jobs']=$scope.fixletids.replace(/ /g,'').replace(/;/g,',');
	// 	postdata['removeURLStructure']=false; 


// Get Test Env for the job
// 		$http({
// 		  method : "POST",
// 		  data : postdata,
// 		  url : "/api/job/review"
// 		}).then(function mySucces(response) {
// 		    $scope.fixletids_confirm = response.data["data"]["testcases"];
// 		  }, function myError(response) {
// 		    console.log(response.statusText);
// 		});
// };
	// $scope.confirm = function() {
	// 	//classify valid & unique fixlet ids 

	// 	var newJobs = {};
	// 	var jobs = [];
	// 	var i;
	// 	var foundFID = 0;
	// 	var listTestCases=$scope.fixletids_confirm;
	// 	var FID = "";
	// 	for( i=0; i<listTestCases.length; i ++){
	// 		FID = listTestCases[i]["fixletID"];
	// 		listTestCases[i]["status"] = "CREATED";

	// 		foundFID = jobs.indexOf(FID);
	// 		if(foundFID == -1){
	// 			jobs.push(FID);
	// 		}			
	// 	}
	// 	//Empty jobs list close modal and exit function

		
	// 	//Post scope.fixletids_confirm to url
	// 	newJobs["jobs"] = jobs.join();
	// 	newJobs["removeURLStructure"] = false;
	// 	newJobs["testcases"] = listTestCases; 

	// 	$http({
	// 	  method : "POST",
	// 	  data : newJobs,
	// 	  url : "/api/job"
	// 	}).then(function mySucces(response) {
	// 	    console.log(response.data["status"]);
	// 	  }, function myError(response) {
	// 	    console.log(response.statusText);
	// 	});
	// };

	$scope.closeM =function  ()  {
		modalClose("#verfiyJobModal");
		//update table in 1 second
	};


}); 