var app = angular.module ('restApiTester');

app.controller ('TestsController', ['$scope', '$stateParams', 'testsService', function ($scope, $stateParams, testsService) {

	var self = this;

	self.detail = self.tests = self.statistics = {};
	self.statisticsButton = 7;

	$scope.$on ('addedRequestIntoTest', function (event, request) {
		if (request.hasOwnProperty ('assignedToTest') && request.assignedToTest.testsId == $scope.testId)
			self.initDetail ();

	});

	self.initStatistics = function (ageInDays) {
		var environmentId = $stateParams.environmentId || $scope.environmentId;
		var testId = $stateParams.testId || $scope.testId;

		testsService.getStatistics (ageInDays, {
			environmentId: environmentId,
			testId: testId
		}).then (function (statistics) {
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

	self.newTest = function () {
		var environmentId = $stateParams.environmentId;

		testsService.create (environmentId, self.formData).then (function (response) {
			self.initTestOverview ();
		});
	};

	self.assign = function () {
		var testId = $stateParams.testId;

		// todo

		testsService.assignRequest ().then (function (response) {

		});
	};

	return self;
}]);