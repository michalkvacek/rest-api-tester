var app = angular.module ('restApiTester');

app.controller ('TestsController', ['$scope', '$stateParams', 'testsService', function ($scope, $stateParams, testsService) {

	var self = this;

	self.detail = self.tests = self.statistics = {};

	$scope.$on ('requestCreated', function (event, request) {
		if (request.hasOwnProperty ('testsId') && request.testsId == $scope.testId)
			self.initDetail ();
	});

	self.initStatistics = function () {
		var environmentId = $stateParams.environmentId;

		testsService.getStatistics (environmentId).then (function (statistics) {
			self.statistics = statistics.data;
		});
	};

	self.initTestOverview = function () {
		var environmentId = $stateParams.environmentId;

		testsService.getOverview (environmentId).then (function (tests) {
			self.tests = tests.data;
		});
	};

	self.initDetail = function () {
		var testId = $stateParams.testId;

		testsService.getDetail (testId).then (function (test) {
			$scope.testId = testId;
			$scope.environmentId = test.data.environmentsId;

			self.detail = test.data;
		});
	};

	return self;
}]);