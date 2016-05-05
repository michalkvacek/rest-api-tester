var app = angular.module ('restApiTester');
app.controller ('EnvironmentsController', ['$scope', '$rootScope', '$state', '$timeout', 'testsResultsService', 'environmentsService', '$stateParams',
	function ($scope, $rootScope, $state, $timeout, testsResultsService, environmentsService, $stateParams) {
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
			$rootScope.enableLoadingDashboardTests = loadDasboardTests;

			// get all environments in given project
			environmentsService.getOverview (projectId).then (function (response) {

				if (response.status != 200)
					return;

				self.overview = response.data;

				$rootScope.setEnvironment (selectedEnvironmentId, projectId);
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
				if (response.status != 200) 
					return
				
				self.detail = response.data;

				// update breadcrumbs
				if (updateBreadcrumbs)
					$rootScope.breadcrumbs = [{
						label: 'Settings',
						href: $state.href ('environment_settings', {environmentId: response.data.id})
					}];
			});
		};

		/**
		 * Create new environment in current project
		 */
		self.create = function () {
			var projectId = $stateParams.projectId;

			environmentsService.create (projectId, self.formData).then (function (response) {
				if (response.status != 201) {
					alert('error');
					return;
				}

				self.initOverview ();

				self.manageEnvironments = false;
			});
		};

		self.edit = function () {
			var environmentId = $stateParams.environmentId;

			environmentsService.edit (environmentId, self.formData).then (function (data) {
				$rootScope.refreshProjectOverview ();
				// self.initOverview(data.data.projectsId, environmentId);
				self.loadDetail ();
			});
		};

		self.delete = function (environmentId) {
			if (confirm ('Really?')) {
				environmentsService.delete (environmentId).then (function (response) {
					self.initOverview ();
				});
			}
		};

		self.assignUser = function () {
			var environmentId = $stateParams.environmentId;

			environmentsService.addUser (environmentId, self.addUser).then (function (response) {
				self.loadDetail ();

				$ ('#new-user').foundation ('close');
			});
		};

		self.removeUser = function (userId) {
			var environmentId = $stateParams.environmentId;

			if (confirm ('Really?')) {
				environmentsService.removeUser (environmentId, userId).then (function (response) {
					self.loadDetail ();
				});
			}
		};

		return self;

	}]);
