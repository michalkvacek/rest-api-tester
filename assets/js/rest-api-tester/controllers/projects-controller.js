var app = angular.module ('restApiTester');
app.controller ('ProjectsController', ['$scope', '$location', 'projectsService', function ($scope, $location, projectsService) {
	var controller = this;

	$scope.formData = {};
	$scope.projects = {};

	var initOverview = function () {
		projectsService.getOverview ().then (function (response) {
			var data = response.data;

			$scope.projects = data.ownProjects.concat (data.managedProjects);
		});
	};

	initOverview();

	return {
		create: function () {
			projectsService.create ($scope.formData).then (function (data) {
				initOverview();
			});

			$('#new-project').foundation('close');
		}
	}

}]);
