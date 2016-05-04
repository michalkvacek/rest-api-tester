var app = angular.module ('restApiTester');

app.controller ('TestsResultsController', ['$scope', '$rootScope', '$stateParams', '$state', '$filter', '$timeout', 'testsResultsService',
	function ($scope, $rootScope, $stateParams, $state, $filter, $timeout, testsResultsService) {

		var self = this;

		self.test = {};
		self.statistics = {};
		$rootScope.testList = [];

		$rootScope.loadTests = function (withTimeout) {

			if (typeof withTimeout == 'undefined')
				withTimeout = true;

			testsResultsService.getOverview (1).then (function (response) {
				$rootScope.testList = response.data;

				for (i in $rootScope.testList) {
					$rootScope.$broadcast ('testResultChanged', $rootScope.testList[i]);
				}

				if (withTimeout)
					$timeout ($rootScope.loadTests, 30 * 1000);
			});
		};

		$rootScope.loadTests ();

		self.init = function () {
			var resultId = $stateParams.testResultId;

			testsResultsService.getDetail (resultId).then (function (response) {
				$rootScope.setEnvironment (response.data.environmentsId);

				$rootScope.breadcrumbs = [
					{
						label: 'Test: ' + response.data.testName,
						href: $state.href ('test_detail', {testId: response.data.testsId})
					},
					{
						label: 'Result from ' + $filter ('date') (response.data.updatedAt, 'short'),
						href: $state.href ('test_result', {testResultId: response.data.id})
					}];

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