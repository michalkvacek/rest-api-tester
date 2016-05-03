var app = angular.module ('restApiTester');
app.controller ('EnvironmentsController', ['$scope', '$rootScope', '$state', '$timeout', 'testsResultsService', 'environmentsService', '$stateParams',
	function ($scope, $rootScope, $state, $timeout, testsResultsService, environmentsService, $stateParams) {
		var self = this;

		self.formData = {};
		self.overview = {};
		self.addUser = {};

		$rootScope.enableLoadingDashboardTests = true;
		$rootScope.dashboardTests = [];
		$rootScope.failedDasboardTests = {};

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

		self.initOverview = function (projectId, selectedEnvironmentId) {
			if (typeof projectId == 'undefined')
				projectId = $stateParams.projectId;

			environmentsService.getOverview (projectId).then (function (response) {
				self.overview = response.data;

				$rootScope.setEnvironment (selectedEnvironmentId, projectId);
			});
		};

		self.loadDetail = function () {
			var environmentId = $stateParams.environmentId;
			$rootScope.setEnvironment (environmentId);

			environmentsService.detail (environmentId).then (function (response) {
				self.detail = response.data;

				$rootScope.breadcrumbs = [
					{
						label: 'Settings',
						href: $state.href ('environment_settings', {environmentId: response.data.id})
					}
				];
			});
		};

		self.create = function () {
			var projectId = $stateParams.projectId;

			environmentsService.create (projectId, self.formData).then (function (data) {
				self.initOverview ();
				$ ('#new-environment').foundation ('close');
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

				$('#new-user').foundation('close');
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
