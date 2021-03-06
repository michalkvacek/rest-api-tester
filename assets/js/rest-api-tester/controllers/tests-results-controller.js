window.app.controller ('TestsResultsController', ['$scope', '$rootScope', '$stateParams', '$state', '$filter', '$interval', '$translate', 'notificationsService', 'testsResultsService',
	function ($scope, $rootScope, $stateParams, $state, $filter, $interval, $translate, notificationsService, testsResultsService) {

		var self = this,
			testResultsFirstRun = true;

		self.test = {};
		self.statistics = {};
		self.lastTestsAge = 2;

		// list of tests from last self.lastTestsAge hours
		$rootScope.testList = [];
		$rootScope.testAddedOrInProgress = false;
		$rootScope.currentTestResult = false;
		$rootScope.lastTestResults = {};

		$rootScope.$on ('testResultChanged', function (event, testsId, resultId) {
			if (resultId == $rootScope.currentTestResult) {
				self.init ();
				self.initStatistics ();
			}
		});

		/**
		 * Load last tests into sidebar
		 *
		 * Currently using AJAX polling... :(
		 */
		$rootScope.loadTests = function () {
			testsResultsService.getOverview (self.lastTestsAge).then (function (response) {
				var sentEvents = {}, result = {}, lastResult = {}, broadcast = false;

				// iterate over all found test responses
				for (i in response.data) {
					result = response.data[i];
					lastResult = $rootScope.lastTestResults[result.id];

					broadcast = false;

					if (typeof lastResult == 'undefined') {
						$rootScope.lastTestResults[result.id] = {
							status: result.status,
							position: $rootScope.testList.length
						};

						$rootScope.testList.push (result);

						broadcast = true;

					} else if (lastResult.status != result.status) {
						// some updated test

						broadcast = true;

						// send notification if test passed or not
						if (result.status == 'success') {
							$translate ('Test :name proběhl úspěšně!', {name: result.testName}).then (function (translation) {
								notificationsService.push ('success', translation);
							});
						} else if (result.status == 'failed') {
							$translate ('Test :name selhal!', {name: result.testName}).then (function (translation) {
								notificationsService.push ('alert', translation);
							});
						}

						$rootScope.lastTestResults[result.id].status = result.status;
						$rootScope.testList[lastResult.position] = result;
					}

					// send event about changed test
					if (broadcast && !testResultsFirstRun && sentEvents[result.testsId] == undefined) {
						$rootScope.$broadcast ('testResultChanged', result.testsId, result.id);
						sentEvents[result.testsId] = true;
						broadcast = true;
					}
				}

				$rootScope.testAddedOrInProgress = false;

				testResultsFirstRun = false;
			});
		};

		$rootScope.loadTests();
		$interval ($rootScope.loadTests, 30 * 1000);

		/**
		 * Load test result
		 */
		self.init = function () {
			var resultId = $stateParams.testResultId;

			testsResultsService.getDetail (resultId).then (function (response) {
				$rootScope.setEnvironment (response.data.environmentsId);
				$rootScope.currentTestResult = resultId;

				// update breadcrumbs
				$translate ('Test').then (function (transTest) {
					$translate ('Výsledek z').then (function (resultFrom) {
						$rootScope.breadcrumbs = [
							{
								label: transTest + ': ' + response.data.testName,
								href: $state.href ('test_detail', {testId: response.data.testsId})
							},
							{
								label: resultFrom + ' ' + $filter ('date') (response.data.updatedAt, 'short'),
								href: $state.href ('test_result', {testResultId: response.data.id})
							}];
					});
				});

				self.test = response.data;
			}, function (response) {
				switch (response.status) {
					case 404:
						$translate ('Požadovaný výsledek neexistuje.').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;
					case 403:
						$translate ('Pro zobrazení tohoho výsledku nemáte dostatečné oprávnění.').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;
					default:
						$translate ('Nelze vykonat požadavek').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;
				}
			});
		};

		/**
		 * Load statistics for current test result
		 */
		self.initStatistics = function () {
			var resultId = $stateParams.testResultId;

			testsResultsService.getStatistics (resultId).then (function (response) {
				self.statistics = response.data;
			})
		};

		return self;
	}]);