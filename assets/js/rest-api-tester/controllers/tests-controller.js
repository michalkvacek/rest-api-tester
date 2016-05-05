var app = angular.module ('restApiTester');

app.controller ('TestsController', ['$scope', '$rootScope', '$timeout', '$filter', '$state', '$stateParams', 'testsService', 'headersService',
	function ($scope, $rootScope, $timeout, $filter, $state, $stateParams, testsService, headersService) {

		var self = this;

		self.formData = {};
		self.detail = {};
		self.tests = {};
		self.statistics = {};
		self.formData.headers = {};
		self.statisticsButton = 7;
		self.scheduleData = {run: 'periodicaly', runInterval: "60"};
		self.headers = {};
		self.assignedRequestIds = {};
		self.currentTestId = null;

		// update test detail when test has changed its status (loaded from sidebar)
		$rootScope.$on ('testResultChanged', function (event, testId) {
			if (testId == self.currentTestId) {
				self.initDetail (false);
				self.initStatistics (self.statisticsButton);
			}
		});

		// refresh list of all requests and test detail when new request was added/changed
		$scope.$on ('addedRequestIntoTest', function (event, request) {
			if (request.hasOwnProperty ('assignedToTest') && request.assignedToTest.testsId == $scope.testId)
				self.initDetail ();
		});

		/**
		 * Load statistical info into test detail
		 *
		 * @param ageInDays
		 */
		self.initStatistics = function (ageInDays) {
			self.statisticsButton = ageInDays;

			var environmentId = $stateParams.environmentId || $scope.environmentId;
			var testId = $stateParams.testId || $scope.testId;

			$rootScope.setEnvironment (environmentId);

			testsService.getStatistics (ageInDays, {
				environmentId: environmentId,
				testId: testId
			}).then (function (statistics) {
				self.statistics = statistics.data;
			});
		};

		/**
		 * Load all tests from environment given as $stateParams attribute
		 */
		self.initTestOverview = function () {
			var environmentId = $stateParams.environmentId;
			$rootScope.setEnvironment (environmentId);

			// get data
			testsService.getOverview (environmentId).then (function (tests) {
				self.tests = tests.data;

				// reinit datetime picker for scheduling test
				$rootScope.reinitDateTimePicker ();
			});
		};

		/**
		 * Init current test detail
		 *
		 * @param refreshBreadcrumbs boolean should breadcrumbs be updated?
		 */
		self.initDetail = function (refreshBreadcrumbs) {
			var testId = $stateParams.testId;

			if (typeof testId == 'undefined')
				return;

			// currentTestId is used for reloading test detail when test is changed
			self.currentTestId = testId;

			// sometimes we need to load test detail, but keep breadcrumbs info
			if (typeof refreshBreadcrumbs == 'undefined')
				refreshBreadcrumbs = true;

			testsService.getDetail (testId).then (function (response) {
				var test = response.data;
				$scope.testId = testId;
				$scope.environmentId = test.environmentsId;

				// save request ids for usage in assigning new requests
				self.assignedRequestIds = {};

				// save request ids
				for (i in test.requests) {
					self.assignedRequestIds[test.requests[i].id] = true;
				}

				// refresh breadcrumbs when needed
				if (refreshBreadcrumbs)
					$rootScope.breadcrumbs = [{
						label: 'Test: ' + test.name,
						href: $state.href ('test_detail', {testId: test.id})
					}];

				$rootScope.setEnvironment (test.environmentsId);

				self.detail = test;
				self.detail.nextRunRaw = self.detail.nextRun;
				self.detail.nextRun = $filter ('date') (self.detail.nextRun, "yyyy-MM-dd HH:mm");
				self.detail.runInterval = "" + test.runInterval; // cast to string, because of selecting default value
				self.detail.run = test.runInterval > 0 ? 'periodicaly' : 'once';
			});
		};

		/**
		 * Create new test in given environment
		 */
		self.newTest = function () {
			var environmentId = $stateParams.environmentId;

			$rootScope.setEnvironment (environmentId);

			testsService.create (environmentId, self.formData).then (function (response) {
				self.initTestOverview ();

				self.newTestWindow = false;
			});
		};

		/**
		 * Setup form data for scheduled run
		 *
		 * Test can be also scheduled in edit.
		 *
		 * @param test
		 */
		self.setupSchedule = function (test) {
			self.scheduleData.testsId = test.id;
			self.scheduleData.nextRun = $filter ('date') (test.nextRun, "yyyy-MM-dd HH:mm");
			self.scheduleData.runInterval = "" + test.runInterval; // cast to string, because of selecting default value
			self.scheduleData.run = test.runInterval > 0 ? 'periodicaly' : 'once';
		};

		/**
		 * Set only schedule for test
		 *
		 * Test can also be scheduled using edit() method.
		 */
		self.schedule = function () {
			if (self.scheduleData.run == 'once')
				delete self.scheduleData.runInterval;

			testsService.schedule (self.scheduleData.testsId, self.scheduleData).then (function (response) {
				self.initTestOverview ();

				self.scheduleWindow = false;
			});
		};

		/**
		 * Save form with edited test data
		 *
		 * This method edits only name, description and scheduled info, requests and other stuff is edited in separate methods
		 *
		 * @param closeWindow boolean should modal window be closed?
		 */
		self.edit = function (closeWindow) {
			if (typeof closeWindow == 'undefined')
				closeWindow = true;

			// delete some unneeded data
			delete self.formData.headers;
			delete self.formData.requests;
			delete self.formData.environmentsId;
			delete self.formData.usersId;
			delete self.formData.runnedTests;

			testsService.edit (self.formData.id, self.formData).then (function (response) {
				self.initDetail ();

				if (closeWindow)
					self.manageTest = false;
			})
		};

		/**
		 * Add given test into queue
		 *
		 * @param testId
		 */
		self.run = function (testId) {
			$rootScope.testAddedOrInProgress = true;

			// update current model
			self.detail.lastRunStatus = 'waiting_for_response';

			testsService.run (testId).then (function (response) {
				// becase of some time needed for preparing test we will display some "waiting" image before loading test list again
				$timeout (function () {
					$rootScope.loadTests (false);
				}, 3 * 1000);
			});
		};

		/**
		 * Add tests from given environment into queue for testing
		 *
		 * @param environmentId
		 */
		self.runAll = function (environmentId) {
			$rootScope.testAddedOrInProgress = true;

			testsService.runAll (environmentId).then (function (response) {
				// becase of some time needed for preparing test we will display some "waiting" image before loading test list again
				$timeout (function () {
					$rootScope.loadTests (false);
				}, 3 * 1000);
			});
		};

		/**
		 * Add request into test
		 *
		 * @param requestId
		 */
		self.assignRequest = function (requestId) {
			var testId = $stateParams.testId;

			testsService.assignRequest (testId, requestId).then (function (response) {
				self.initDetail ();
			});
		};

		/**
		 * Remove request from test
		 *
		 * @param requestId
		 */
		self.removeRequest = function (requestId) {
			var testId = $stateParams.testId;

			if (confirm ('Really?')) {
				testsService.removeRequest (testId, requestId).then (function (response) {
					self.initDetail ();
				});
			}
		};

		// ===========================
		// This part maintains headers in test - we need it in this controller, because each action need to reload list of requests

		/**
		 * Edit header and update test details
		 */
		self.headers.edit = function () {
			headersService.edit (self.formData.id, self.formData.headers).then (function (response) {
				self.initDetail ();

				self.manageHeaders = false;
			});
		};

		/**
		 * Delete header and update all requests in current test
		 *
		 * @param id
		 */
		self.headers.delete = function (id) {
			if (confirm ('Opravdu?')) {
				headersService.delete (id).then (function (response) {
					// update test detail
					self.initDetail ();
				});
			}
		};

		/**
		 * Create new header for all requests in current test
		 *
		 * @param testId
		 */
		self.headers.create = function (testId) {
			self.formData.headers.testsId = testId;

			headersService.create (self.formData.headers).then (function (response) {
				self.initDetail ();
				self.manageHeaders = false
			})
		};

		return self;
	}]);