var app = angular.module ('restApiTester');
app.controller ('EnvironmentsController', ['$scope', '$rootScope', '$timeout', 'testsResultsService', 'environmentsService', '$stateParams',
	function ($scope, $rootScope, $timeout, testsResultsService, environmentsService, $stateParams) {
		var self = this;

		self.formData = {};
		self.overview = {};

		$rootScope.enableLoadingDashboardTests = true;
		$rootScope.dashboardTests = [];
		$rootScope.failedDasboardTests = {};

		$rootScope.loadDasboardTests = function (withTimeout) {
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
					$timeout ($rootScope.loadDasboardTests, 30 * 1000);
			});
		};

		$rootScope.loadDasboardTests ();

		self.initOverview = function () {
			var projectId = $stateParams.projectId;
			$rootScope.setEnvironment (undefined, projectId);

			environmentsService.getOverview (projectId).then (function (response) {
				self.overview = response.data;
			});
		};

		self.create = function () {
			var projectId = $stateParams.projectId;

			environmentsService.create (projectId, self.formData).then (function (data) {
				self.initOverview ();
				$ ('#new-environment').foundation ('close');
			});
		};

		self.edit = function (environmentId) {
			environmentsService.create (environmentId, self.formData).then (function (data) {
				self.initOverview ();
				$ ('#edit-environment').foundation ('close');
			});
		};

		self.delete = function (environmentId) {
			if (confirm('Really?')) {
				environmentsService.delete(environmentId).then(function (response) {
					self.initOverview();
				});
			}
		};

		return self;

	}]);
