var app = angular.module ('restApiTester');
app.controller ('EnvironmentsController', ['$scope', 'environmentsService', '$stateParams', function ($scope, environmentsService, $stateParams) {
	var self = this;

	self.formData = {};
	self.overview = {};
	self.statistics = {};

	self.initOverview = function () {
		var projectId = $stateParams.projectId;

		$scope.setEnvironment (undefined, projectId);

		environmentsService.getOverview (projectId).then (function (response) {
			self.overview = response.data;
		});

	};

	self.create = function () {
		var projectId = $stateParams.projectId;

		environmentsService.create (projectId, self.formData).then (function (data) {
			self.initOverview ();
			$ ('#new-environment').foundation ('close');
		});
	};

	return self;

}]);
