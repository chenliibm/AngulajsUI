app.controller('vmEditCtrl', function ($scope, $http, $route,$timeout,vm) {
	
    var snapshotTemplate= {
        name: "",
        appName: "",
        active: 0
    }
	// $scope.fixletids = "";
	// $scope.fixletids_confirm=[];
    $scope.vm = vm;
    // $http({
    //     method: "GET",
    //     url : "/api/testcase/" + testcase.id + "/log"
    // }). then(function success(response) {
    //     $scope.logInfo = response.data["data"];
    // }, function error(response) {
    //     $scope.logInfo = response;
    // });

    $scope.addSnapShot = function() {
        $scope.vm.SnapShots.push(angular.copy(snapshotTemplate));
    }
    $scope.removeSnapShot = function(snapshot) {
        $http({
            method: "DELETE",
            url: "/api/vm/snapshot/"+ snapshot.id,
            data: {snapshot: snapshot}
        }).then(function success(response) {  
            var index = $scope.vm.SnapShots.indexOf(snapshot);
            $scope.vm.SnapShots.splice(index,1);
        }, function error(response) {
            console.log(response);
            alert('Error removing snapshot');
        })
    }
}); 