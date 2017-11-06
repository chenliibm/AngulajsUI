app.controller('vminfoCtrl',  ['$scope', 'orderByFilter','$http','$uibModal', function ($scope, orderBy,$http, $uibModal) {
    $('.nav-tabs a[href="#vminfo"]').tab('show');

    $scope.vmInfo = [];
    $http({
      method : "GET", 
      url  : "/api/vm/all"
    }).then(function mySuccess(response){
      console.log(response.data);
      $scope.vmInfo = response.data["data"];
      $scope.logstatus = response.data["status"];
    }, function myErro(response){
      console.log(response.sstatusText);
    });
      
    $scope.editRow = function(item){
      $uibModal.open({
              templateUrl: 'templates/vm.edit.modal.html',
              controller: 'vmEditCtrl',
              resolve: {
                vm: function(){ 
                  return item;
                }
              },
              size: 'lg'
          });
          return false;
    };
    $scope.removeRow = function(ind){
      $scope.temp=ind;

    };


}]);

   


    


