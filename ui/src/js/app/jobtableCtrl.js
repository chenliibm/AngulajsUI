app.controller('jobtableCtrl', ['$scope', '$filter', '$http', 'Job', '$route', '$interval', function ($scope, $filter,$http, Job,$route,$interval ) {
    $('.nav-tabs a[href="#jobs"]').tab('show');
    // init
   
    $scope.sort = {       
                sortingOrder : 'id',
                reverse : true
            };

    
    $scope.gap = 3; //gap must less than number of pages
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.databaseStatus="";
    $scope.httpStatus="";
    $scope.httpError=""; 
    $scope.items="";



 // $interval(function () {
 //      console.log("hello");
 //                $route.reload();

 //  }, 2000);
// $scope.counter= 1;
// var refresh;
// $scope.stoprefresh = function (){
//      $interval.cancel(refresh);

// };
 $scope.startrefresh = function (){
    console.log("reloading current page");
    $route.reload();

     // console.log($scope.ARswitch);
     // if ($scope.ARswitch){
     //     refresh = $interval (function () {
     //      console.log("reloading current page");


     //      $route.reload();
     // running http request every 5 seconds to refresh data.
     
     //      console.log($scope.counter);
     //      $scope.counter = $scope.coutner+1;

     //    // if ($scope.ARswitch){t} else {$scope.stoprefresh();}

     // }, 2000);
    
     // }else {
     //    $scope.stoprefresh();
     // }


 };


// $scope.$on('$destroy', function() {
//       $scope.stoprefresh();
//     });
    


    $http({
        method : "GET",
        url : "/api/job/all"

    }).then(function mySucces(response) {
        $scope.httpStatus = response.status;
        $scope.databaseStatus = response.data["status"];
        $scope.items = response.data["data"];
        var Njobs = $scope.items.length;
        $scope.itemsPerPage = Njobs <20?Njobs:20;
        var PageGap = Math.ceil(Njobs / $scope.itemsPerPage); 
        $scope.gap = PageGap < 5?PageGap:5;

        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };

        // init the filtered items
        $scope.search = function () {
            $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                for(var attr in item) {
                    if (searchMatch(item[attr], $scope.query))
                        return true;
                }
                return false;
            });
            // take care of the sorting order
            if ($scope.sort.sortingOrder !== '') {
                $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
            }
            $scope.currentPage = 0;
            // now group by pages
            $scope.groupToPages();
           
        };
    
  
        // calculate page in place
        $scope.groupToPages = function () {
            $scope.pagedItems = [];
            
            for (var i = 0; i < $scope.filteredItems.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                }
            }
        };
    
        $scope.range = function (size,start, end) {
            var ret = [];        
            console.log(size,start, end);
                          
            if (size < end) {
                end = size;
                start = size-$scope.gap;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }        
             // console.log(ret);        
            return ret;
        };
        $scope.firstPage=function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage = 0;
            }
        };
        
        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };
        
        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };
         $scope.lastPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage = $scope.pagedItems.length - 1;
            }
        };
        
        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };

        // functions have been describe process the data for display
        $scope.search();



    }, function myError(response) {
        $scope.httpError=response.statusText;
       
    });


    $scope.setSeletectJobId = function(jobid){
         Job.id=jobid;
    };




}]);





app.directive("customSort", function() {
return {
    restrict: 'A',
    transclude: true,    
    scope: {
      order: '=',
      sort: '='
    },
    template : 
      ' <a ng-click="sort_by(order)" style="color: #555555;">'+
      '    <span ng-transclude></span>'+
      '    <i ng-class="selectedCls(order)"></i>'+
      '</a>',
    link: function(scope) {
                
    // change sorting order
    scope.sort_by = function(newSortingOrder) {       
        var sort = scope.sort;
        
        if (sort.sortingOrder == newSortingOrder){
            sort.reverse = !sort.reverse;
        }                    

        sort.sortingOrder = newSortingOrder;        
    };
    
   
    scope.selectedCls = function(column) {
        if(column == scope.sort.sortingOrder){
            return ('icon-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
        }
        else{            
            return'icon-sort' 
        } 
    };      
  }// end link
}
});
