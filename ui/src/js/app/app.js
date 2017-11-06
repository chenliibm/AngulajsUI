$(document).ready(function(){
    $(".nav-tabs a").click(function(){
        $(this).tab('show');
    });
});

console.log('Bootstrap ' + $.fn.tooltip.Constructor.VERSION);
  console.log('Bootstrap Confirmation ' + $.fn.confirmation.Constructor.VERSION);

$('[data-toggle=confirmation]').confirmation({
rootSelector: '[data-toggle=confirmation]',
container: 'body'
});

var app = angular.module("autotest", ["ngRoute",'templates-main','ui.bootstrap','xeditable',"checklist-model"]);


app.config(['$routeProvider',function($routeProvider) {
    $routeProvider
    /*.when("/", {
    	templateUrl : "templates/main.html"

    })
    .when("/home", {
        templateUrl : "templates/main.html"
})*/
    .when("/jobs", {
        templateUrl : "templates/jobtable.html",
        controller : "jobtableCtrl"
    })
    .when("/testcases/:id", {
        templateUrl : "templates/testcasesView.html",
        controller : "testcasesCtrl"
    })
    .when("/vminfo", {
        templateUrl : "templates/vminfo.html",
        controller : "vminfoCtrl"

    }).otherwise({redirectTo:'/jobs'});
}]);


app.run(['editableOptions',function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);

app.service('Job', function() {
  this.id=0;
});

app.directive("deConfirm", function() {
    return function(scope, element, attrs){
        element.find("[data-toggle=confirmation]")
         // .popover({placement: 'bottom' ,html : 'true'});
        .confirmation({
            rootSelector: '[data-toggle=confirmation]',
            container: 'confirmtag'
        });
    };
});

// $('[data-toggle=confirmation]').confirmation({
// rootSelector: '[data-toggle=confirmation]',
// container: 'body'
// });


function testcaseTabSelect(){
    $('.nav-tabs a[href="#testcases"]').tab('show');
}

function modalOpen(modalname){
    $(modalname).modal();
};

function modalClose(modalname){
    $(modalname).modal('toggle');
};


function btnClickVerifyJobM(){
   modalClose("#newjobModal");
   modalOpen("#verfiyJobModal");
}

function editJobs(){ 
    modalClose("#verfiyJobModal");
    modalOpen("#newjobModal");

}

function test(){ 

console.log("test");
}

app.$inject = ['$scope', '$filter', 'job', '$route','$routeParam','$uibModal','xeditable'];
