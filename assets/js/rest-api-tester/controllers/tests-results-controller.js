var app = angular.module ('restApiTester');

app.controller ('TestsResultsController', ['$scope', '$rootScope', '$stateParams', '$state', '$filter', '$timeout', 'notificationsService', 'testsResultsService',
	function ($scope, $rootScope, $stateParams, $state, $filter, $timeout, notificationsService, testsResultsService) {

		var self = this,
			testResultsFirstRun = true;

		self.test = {};
		self.statistics = {};
		self.lastTestsAge = 2;

		// list of tests from last self.lastTestsAge hours
		$rootScope.testList = [];
		$rootScope.testAddedOrInProgress = true;

		/**
		 * Load last tests into sidebar
		 *
		 * Currently using AJAX polling... :(
		 *
		 * @param withTimeout
		 */
		$rootScope.loadTests = function (withTimeout) {

			if (typeof withTimeout == 'undefined')
				withTimeout = true;

			testsResultsService.getOverview (self.lastTestsAge).then (function (response) {

				// iterate over returned tests and try to update only changed tests

				$rootScope.testList = response.data;

				if (!testResultsFirstRun) {
					var sentEvents = {};
					for (i in $rootScope.testList) {
						if (sentEvents[$rootScope.testList[i].testsId] == undefined) {
							$rootScope.$broadcast ('testResultChanged', $rootScope.testList[i].testsId);
							sentEvents[$rootScope.testList[i].testsId] = true;
						}
					}
				}

				$rootScope.testAddedOrInProgress = false;

				testResultsFirstRun = false;

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