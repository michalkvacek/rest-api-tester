var app = angular.module ('restApiTester');

app.controller ('TestsResultsController', ['$scope', '$rootScope', '$stateParams', '$timeout', 'testsResultsService', function ($scope, $rootScope, $stateParams, $timeout, testsResultsService) {

	var self = this;

	self.test = {};
	self.statistics = {};
	$rootScope.testList = [];

	$rootScope.loadTests = function (withTimeout) {

		if (typeof withTimeout == 'undefined')
			withTimeout = true;

		testsResultsService.getOverview (1).then (function (response) {
			$rootScope.testList = response.data;

			if (withTimeout)
				$timeout ($rootScope.loadTests, 30 * 1000);
		});
	};

	$rootScope.loadTests ();

	self.init = function () {
		var resultId = $stateParams.testResultId;

		testsResultsService.getDetail (resultId).then (function (response) {
			$rootScope.setEnvironment (response.data.environmentsId);
			self.test = response.data;
		});
	};

	self.initStatistics = function () {
		var resultId = $stateParams.testResultId;

		testsResultsService.getStatistics (resultId).then (function (response) {
			self.statistics = response.data;
		})
	};

	return self;
}]);