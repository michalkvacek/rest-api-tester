var app = angular.module ('restApiTester');
app.controller ('DashboardController', ['$scope', 'environmentsService', '$stateParams', function ($scope, environmentsService, $stateParams) {
	var controller = this;

	$scope.formData = $scope.environments = $scope.statistics = {};

	var initOverview = function () {
		var projectId = $stateParams.projectId;

		environmentsService.getOverview (projectId).then (function (response) {
			$scope.environments = response.data;
		});

	};

	initOverview ();

	return {
		create: function () {
			environmentsService.create ($scope.formData).then (function (data) {
				initOverview ();
			});

			$ ('#new-environment').foundation ('close');
		}
	}

}]);
