// var app = angular.module ('restApiTester');
window.app.controller ('EnvironmentsController', ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'notificationsService', 'testsResultsService', 'environmentsService', 'testsService', '$stateParams',
	function ($scope, $rootScope, $state, $timeout, $translate, notificationsService, testsResultsService, environmentsService, testsService, $stateParams) {
		var self = this;

		self.formData = {};
		self.overview = {};
		self.addUser = {};

		$rootScope.enableLoadingDashboardTests = false;
		$rootScope.dashboardTests = [];
		$rootScope.failedDasboardTests = {};

		/**
		 * Load list of dasboard tests.
		 *
		 * Currently using AJAX polling... :(
		 *
		 * @param withTimeout
		 */
		$rootScope.loadDashboardTests = function (withTimeout) {
			var projectId = $stateParams.projectId, test = {};

			// turn off loading results for dashboard
			if (!$rootScope.enableLoadingDashboardTests)
				return;

			if (typeof withTimeout == 'undefined')
				withTimeout = true;

			// load results for past 7 days in current project
			testsResultsService.getOverview (7 * 24, projectId).then (function (response) {
				$rootScope.dashboardTests = response.data;

				// separate failed tests from not-failed
				$rootScope.failedDasboardTests = {};
				for (i in $rootScope.dashboardTests) {
					test = $rootScope.dashboardTests[i];

					if (!$rootScope.failedDasboardTests.hasOwnProperty (test.environmentsId))
						$rootScope.failedDasboardTests[test.environmentsId] = [];

					if (test.status == 'failed')
						$rootScope.failedDasboardTests[test.environmentsId].push (test);
				}

				// run again after 30 seconds - if wanted
				if (withTimeout)
					$timeout ($rootScope.loadDashboardTests, 30 * 1000);
			});
		};

		$rootScope.loadDashboardTests ();

		/**
		 * Add tests from given environment into queue for testing
		 *
		 * @param environmentId
		 */
		$rootScope.runEnvironmentTests = function (environmentId) {
			$rootScope.testAddedOrInProgress = true;

			testsService.runAll (environmentId).then (function (response) {
				switch (response.status) {
					case 200:
						// becase of some time needed for preparing test we will display some "waiting" image before loading test list again
						$timeout (function () {
							$rootScope.loadTests (false);
						}, 3 * 1000);
						break;

					case 403:
						$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
							notificationsService.push ('alert', translation);
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
		 * List of all environments
		 *
		 * @param projectId
		 * @param selectedEnvironmentId
		 * @param loadDasboardTests
		 */
		self.initOverview = function (projectId, selectedEnvironmentId, loadDasboardTests) {

			if (typeof loadDasboardTests == 'undefined')
				loadDasboardTests = true;

			if (typeof projectId == 'undefined')
				projectId = $stateParams.projectId;

			// turn ajax polling for loading tests on dasboard?
			if (loadDasboardTests) {
				$rootScope.enableLoadingDashboardTests = loadDasboardTests;
				$rootScope.loadDashboardTests ();
			}

			// get all environments in given project
			environmentsService.getOverview (projectId).then (function (response) {

				switch (response.status) {
					case 200:
						self.overview = response.data;

						$rootScope.setEnvironment (selectedEnvironmentId, projectId);
						break;

					case 403:
						$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;

					case 404:
						$translate ('Požadované prostředí neexistuje. Vyberte prosím jiné.').then (function (translation) {
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
		 * Load detail about curren environment.
		 *
		 * In response are included team members
		 */
		self.loadDetail = function (updateBreadcrumbs) {

			if (typeof updateBreadcrumbs == 'undefined')
				updateBreadcrumbs = true;

			var environmentId = $stateParams.environmentId;
			$rootScope.setEnvironment (environmentId);

			// get detail
			environmentsService.detail (environmentId).then (function (response) {
				switch (response.status) {
					case 200:

						self.detail = response.data;
						self.formData = angular.copy (response.data);

						// update breadcrumbs
						$translate ('Nastavení').then (function (settings) {
							if (updateBreadcrumbs)
								$rootScope.breadcrumbs = [{
									label: settings,
									href: $state.href ('environment_settings', {environmentId: response.data.id})
								}];
						});
						break;

					case 403:
						$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;

					case 404:
						$translate ('Tento projekt neexistuje, nelze zobrazit přehled prostředí.').then (function (translation) {
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
		 * Create new environment in current project
		 */
		self.create = function () {
			var projectId = $stateParams.projectId;

			environmentsService.create (projectId, self.formData).then (function (response) {
				self.initOverview ();

				$rootScope.reinitIdentity ();

				self.manageEnvironments = false;
			}, function (response) {
				switch (response.status) {
					case 403:
						$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
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
		 * Edit current environment
		 */
		self.edit = function () {
			var environmentId = $stateParams.environmentId;

			// ignore not-changed form
			if (self.formData.name == self.detail.name && self.formData.description == self.detail.description && self.formData.apiEndpoint == self.detail.apiEndpoint)
				return;

			environmentsService.edit (environmentId, self.formData).then (function (data) {
				$rootScope.refreshProjectOverview ();
				self.loadDetail ();

				$translate ('Úspěšně uloženo.').then (function (translation) {
					notificationsService.push ('success', translation);
				});
			}, function (response) {
				switch (data.status) {
					case 403:
						$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
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
		 * Delete given environment
		 * @param environmentId
		 */
		self.delete = function (environmentId) {
			if (confirm ($translate.instant ('Opravdu?'))) {
				environmentsService.delete (environmentId).then (function (response) {
					self.initOverview ();
				}, function (response) {
					switch (response.status) {
						case 403:
							$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
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
			}
		};

		/**
		 * Assign user to current environment
		 */
		self.assignUser = function () {
			var environmentId = $stateParams.environmentId;

			environmentsService.addUser (environmentId, self.addUser).then (function (response) {
				self.loadDetail ();

				self.manageUser = false;
			}, function (response) {
				switch (response.status) {
					case 403:
						$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
							notificationsService.push ('alert', translation);
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
		 * Remove specified user from current environment
		 *
		 * @param userId
		 */
		self.removeUser = function (userId) {
			var environmentId = $stateParams.environmentId;

			if (confirm ($translate.instant ('Opravdu?'))) {
				environmentsService.removeUser (environmentId, userId).then (function (response) {
					self.loadDetail ();
				}, function (response) {
					switch (response.status) {
						case 403:
							$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
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
			}
		};

		return self;

	}]);
