var app = angular.module ('restApiTester');
app.controller ('ProjectsController', ['$rootScope', '$state', 'projectsService', function ($rootScope, $state, projectsService) {
	var self = this;

	self.formData = {};
	self.overview = {};

	$rootScope.currentEnvironmentId = undefined;
	$rootScope.currentProjectId = undefined;

	$rootScope.currentProject = {};
	$rootScope.currentEnvironment = {};
	$rootScope.availableEnvironments = {};

	$rootScope.$on ('projectOverviewLoaded', function (event) {
		setProjectAndEnvironment ();
	});

	var setProjectAndEnvironment = function () {
		var environmentId = $rootScope.currentEnvironmentId,
			projectId = $rootScope.currentProjectId,
			project = {};

		if (typeof environmentId == 'undefined') {
			$rootScope.selectEnvironment (undefined);

			if (typeof projectId == 'undefined') {
				$rootScope.selectProject (undefined);

				return;
			}
		}

		for (i in self.overview) {
			project = self.overview[i];

			if (project.id == projectId) {
				$rootScope.selectProject (project);
			}

			for (e in project.environments) {
				if (project.environments[e].id == environmentId) {

					$rootScope.selectProject (project);
					$rootScope.selectEnvironment (project.environments[e]);

					return;
				}
			}
		}
	};

	$rootScope.selectProject = function (project) {
		$rootScope.currentProject = project;

		if (typeof project != 'undefined') {
			$rootScope.currentProjectId = project.id;
			$rootScope.availableEnvironments = project.environments;
		}
	};

	$rootScope.selectEnvironment = function (environment, options) {
		if (typeof options == 'undefined')
			options = {};

		$rootScope.currentEnvironment = environment;

		if (options.hasOwnProperty ('redirectToTests')) {
			$state.go ('tests', {environmentId: environment.id});
		}
	};

	$rootScope.setEnvironment = function (environmentId, projectId) {
		$rootScope.currentEnvironmentId = environmentId;
		$rootScope.currentProjectId = projectId;
		setProjectAndEnvironment ();
	};

	self.initOverview = function () {
		projectsService.getOverview ().then (function (response) {
			self.overview = response.data.managedProjects;

			$rootScope.$broadcast ('projectOverviewLoaded');
		});
	};

	self.create = function () {
		projectsService.create (self.formData).then (function (data) {
			self.initOverview ();
		});

		$ ('#new-project').foundation ('close');
	};

	return self;

}
]);
