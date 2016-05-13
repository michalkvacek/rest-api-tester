// var app = angular.module ('restApiTester');

window.app.controller ('TestsController', ['$scope', '$rootScope', '$timeout', '$filter', '$state', '$stateParams', 'testsService', 'headersService', '$translate', "notificationsService",
	function ($scope, $rootScope, $timeout, $filter, $state, $stateParams, testsService, headersService, $translate, notificationsService) {

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
		self.detailInitialized = false;

		// update test detail when test has changed its status (loaded from sidebar)
		$rootScope.$on ('testResultChanged', function (event, testId) {
			if (testId == self.currentTestId) {
				if (self.detailInitialized)
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

			testsService.getStatistics (ageInDays, {
				environmentId: environmentId,
				testId: testId
			}).then (function (statistics) {
				self.statistics = statistics.data;

				if (testId) {
					self.currentTestId = testId;
				}

				$rootScope.setEnvironment (environmentId);

			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
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

			}, function (response) {
				switch (response.status) {
					case 404:
						$translate ('Požadované prostředí neexistuje. Vyberte prosím jiné.').then (function (translation) {
							notificationsService.push ('alert', $translate.instant (translation));
							$rootScope.refreshProjectOverview();
							$state.go ('projects');
						});
						break;

					case 403:
						$translate ('Pro přístup do tohoto testu nemáte dostatečné oprávnění.').then (function (translation) {
							notificationsService.push ('alert', $translate.instant (translation));
							$rootScope.refreshProjectOverview();
							$state.go ('projects');
						});

						break;

					default:
						$translate ('Nelze vykonat požadavek').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
						break;
				}
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

			// sometimes we need to load test detail, but keep breadcrumbs info
			if (typeof refreshBreadcrumbs == 'undefined')
				refreshBreadcrumbs = true;

			testsService.getDetail (testId).then (function (response) {
				// currentTestId is used for reloading test detail when test is changed
				self.currentTestId = testId;
				self.detailInitialized = true;

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
					$translate ('Test').then (function (translatedTest) {
						$rootScope.breadcrumbs = [{
							label: translatedTest + ': ' + test.name,
							href: $state.href ('test_detail', {testId: test.id})
						}];
					});

				$rootScope.setEnvironment (test.environmentsId);

				self.detail = test;
				self.detail.nextRunRaw = self.detail.nextRun;
				self.detail.nextRun = $filter ('date') (self.detail.nextRun, "yyyy-MM-dd HH:mm");
				self.detail.runInterval = "" + test.runInterval; // cast to string, because of selecting default value
				self.detail.run = test.runInterval > 0 ? 'periodicaly' : 'once';
			}, function (response) {

				switch (response.status) {
					case 403:
						$translate ('Pro přístup do tohoto prostředí nemáte dostatečné oprávnění.').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});

						break;
					case 404:
						$translate ('Požadovaný test neexistuje. Vyberte prosím jiný.').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});

						break;
					default:
						$translate ('Nelze vykonat požadavek').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
						break;
				}
			});
		};

		/**
		 * Create new test in given environment
		 */
		self.newTest = function () {
			var environmentId = self.formData.environmentsId || $stateParams.environmentId;

			if (typeof environmentId == 'undefined') {
				$translate ('Není zvoleno prostředí, do kterého má být test vytvořen. Nelze pokračovat.').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
				return;
			}

			testsService.create (environmentId, self.formData).then (function (response) {
				$rootScope.setEnvironment (environmentId);
				$state.go('test_detail', {testId: response.data.id});

				self.manageTest = false;
			}, function (response) {
				switch (response.status) {

					case 403:
						$translate ('Pro přístup do tohoto prostředí nemáte dostatečné oprávnění.').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;

					default:
						$translate ('Nelze vykonat požadavek').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
						break;
				}
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
			self.manageSchedule = true;

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

				self.manageSchedule = false;
			}, function (response) {
				$translate ('Nelze naplánovat spuštění testu. Kód odpovědi ze serveru: :statusCode', {statusCode: response.status}).then (function (translation) {
					notificationsService.push ('alert', translation);
				});
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
			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
			}, function (response) {
				$translate ('Nelze uložit test. Kód odpovědi ze serveru: :statusCode', {statusCode: response.status}).then (function (translation) {
					notificationsService.push ('alert', translation);
				});
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
			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
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
			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
			});
		};

		/**
		 * Remove request from test
		 *
		 * @param requestId
		 */
		self.removeRequest = function (requestId) {
			var testId = $stateParams.testId;

			$translate ('Opravdu?').then (function (really) {
				if (confirm (really)) {
					testsService.removeRequest (testId, requestId).then (function (response) {
						self.initDetail ();
					}, function (response) {
						$translate ('Nelze vykonat požadavek').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
					});
				}
			});

		};

// ===========================
// This part maintains headers in test - we need it in this controller, because each action need to reload list of requests

		/**
		 * Edit header and update test details
		 */
		self.headers.edit = function () {
			headersService.edit (self.formData.headers.id, self.formData.headers).then (function (response) {
				self.initDetail ();

				self.manageHeaders = false;
			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
			});
		};

		/**
		 * Delete header and update all requests in current test
		 *
		 * @param id
		 */
		self.headers.delete = function (id) {
			$translate ('Opravdu?').then (function (really) {
				if (confirm (really)) {
					headersService.delete (id).then (function (response) {
						// update test detail
						self.initDetail ();
					}, function (response) {
						$translate ('Nelze vykonat požadavek').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
					});
				}
			});
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
			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
			})
		};

		return self;
	}])
;