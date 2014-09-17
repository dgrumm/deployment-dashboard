var dashboard = angular.module("dashboard", ['ui.bootstrap', 'ngRoute']).controller("mainController", mainController)
.controller("settingsController", settingsController)
.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'settingsController'
    }).when('/', {
    templateUrl : 'partials/dashboard.html',
    controller  : 'mainController'
    });
});

dashboard.factory('projectFactory', function ($rootScope) {
    var projectFactory = {
     projects :
        [
        {name: 'example-project', start: 'revision#', end: 'HEAD', stories: null, svn: "example", branch:null},
        {name: 'another-example-project', start: 'revision#', end: 'HEAD', stories: null, svn: "example", branch: null}
    ],
    removeProject: function(project) {
        this.projects = this.projects.filter(function(oldProject) {
            return oldProject.name != project.name;
        });
    },
    addProject: function(project) {
        this.projects.push(project);
        }
    };

 
    return projectFactory;
});



function settingsController($scope, $routeParams, projectFactory, $location) {
    $scope.projects = projectFactory;
    $scope.params = $routeParams;
    $scope.name = "settingsController";
    $scope.project = {"end" : "HEAD"};
    $scope.hello = function() {
        console.log($scope.params);
    };
    $scope.addProject = function(project) {
        project = angular.copy(project);
        projectFactory.addProject(project);
        $location.path("/");
    };
    $scope.master = {};
};

function mainController($scope, $route, $routeParams, $location, $http, projectFactory){
        $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
    $scope.projects = projectFactory.projects;

    $scope.projectSettings = function() {
        $location.path( "/settings" );
    };

    $scope.removeProject = function(project){
        console.log($scope.allProjects.length);
        projectFactory.removeProject(project);
        $scope.allProjects = $scope.allProjects.filter(function(oldProject) {
            return oldProject.name != project.name;
        });
        console.log($scope.allProjects.length);
    };

    $scope.gitProjects = [
        {name: 'example-project', start: 'sha', end:'', stories: null},
        {name: 'example-project', start: 'sha', end:'', stories: null}
    ];

    $scope.allProjects = []

    function sortByStatus(data) {
        var sorted_data = [];
        var possibleStages = ["Backlog", "In Progress", "Validation", "Signoff", "Done", undefined];
        possibleStages.forEach(function (stage) {
            for (story in data) {
                if (data[story].stage === stage) {
                    sorted_data.push(data[story]);
                }
            }
        });
        return sorted_data;
    }


    $scope.projects.forEach(function (project) {
        var url = '/stories/' + project.name + '/' + project.start + '/' + project.end + '/' + encodeURIComponent(project.svn);
        $http.get(url)
            .success(function (data) {
                project.stories = sortByStatus(data);
                $scope.allProjects.push(project);
            })
            .error(function (data) {
                console.log("Error: " + data);
            });
    });

    $scope.gitProjects.forEach(function (project) {
        var url = '/githubstories/' + project.name + '/' + project.start;
        $http.get(url)
            .success(function (data) {
                project.stories = sortByStatus(data);
                $scope.allProjects.push(project);
            })
            .error(function (data) {
                console.log("Error: " + data);
            });
        });

    $scope.exportData = function () {
        $http.post('/export', $scope.projects)
            .success(function (data) {
                alertMsg("Export success, find spread-sheet in project root dir");
                console.log("export success");
            })
            .error(function (data) {
                  alertMsg("Export failed");
                console.log("Error: " + data);
            });
    };

    function alertMsg(message) {
        window.alert(message);
    };
};


