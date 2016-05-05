var app = angular.module ('restApiTester');
app.controller ('ProjectsController', ['$rootScope', '$state', '$stateParams', 'projectsService', function ($rootScope, $state, $stateParams, projectsService) {
	var self = this;

	self.formData = {};
	self.overview = {};

	$rootScope.currentEnvironmentId = undefined;
	$rootScope.currentProjectId = undefined;

	$rootScope.currentProject = {};
	$rootScope.currentEnvironment = {};
	$rootScope.availableEnvironments = {};

	/**
	 * Listen to event fired after loading list of all projects and set project and environment
	 */
	$rootScope.$on ('projectOverviewLoaded', function (event) {
		setProjectAndEnvironment ();
	});

	/**
	 * Globally accessible method for reloading list of all projects.
	 */
	$rootScope.refreshProjectOverview = function () {
		self.initOverview ();
	};

	/**
	 * Load list of all projects
	 */
	self.initOverview = function () {
		projectsService.getOverview ().then (function (response) {

			if (response.status != 200) {

				return;
			}

			self.overview = response.data.managedProjects;

			// fire event to notify any listeners that project overview was re/loaded
			$rootScope.$broadcast ('projectOverviewLoaded');
		});
	};

	/**
	 * Load details about current project - this method is used in settings
	 *
	 * @param updateBreadcrumbs boolean should beradcrumbs be updated?
	 */
	self.loadDetail = function (updateBreadcrumbs) {
		if (typeof updateBreadcrumbs == 'undefined')
			updateBreadcrumbs = true;

		var projectId = $stateParams.projectId;
		$rootScope.setEnvironment (undefined, projectId);

		// load project details
		projectsService.detail (projectId).then (function (response) {

			if (response.status != 200) {
				// handle error

				return;
			}

			self.detail = response.data;

			// update breadcrumbs
			if (updateBreadcrumbs)
				$rootScope.breadcrumbs = [
					{
						label: 'Settings',
						href: $state.href ('project_settings', {projectId: response.data.id})
					}
				];
		});
	};

	/**
	 * Create new project
	 */
	self.create = function () {
		projectsService.create (self.formData).then (function (response) {

			if (response.status == 201) {
				self.initOverview ();
			} else {
				// handle error
			}
		});

		self.newProjectWindow = false;
	};

	/**
	 * Update current project
	 */
	self.edit = function () {

		// check if user inserted project name
		if (typeof self.formData.name == 'undefined' || self.formData.name == '')
			return;

		projectsService.edit (self.formData.id, self.formData).then (function (response) {
			if (response.status == 200)
				self.initOverview ();
		});
	};

	// ----------------------------------------------

	// methods below are used for updating current project/environment

	/**
	 * Set current project and current environment.
	 *
	 * These objects are used in breadcrumbs and sidebar for displaying menu.
	 */
	var setProjectAndEnvironment = function () {
		var environmentId = $rootScope.currentEnvironmentId || $stateParams.environmentId,
			projectId = $rootScope.currentProjectId || $stateParams.projectId,
			project = {};

		if (typeof environmentId == 'undefined') {
			$rootScope.selectEnvironment (undefined);

			if (typeof projectId == 'undefined') {
				$rootScope.selectProject (undefined);

				return;
			}
		}

		// try to find proper environment and project
		for (i in self.overview) {
			project = self.overview[i];

			// user set also projectId
			if (project.id == projectId) {
				$rootScope.selectProject (project);

				if (typeof environmentId == 'undefined')
					return;
			}

			// when no projectId is set, we need to iterate over all environments in all projects and find the right one
			for (e in project.environments) {
				if (project.environments[e].id == environmentId) {
					$rootScope.selectProject (project);
					$rootScope.selectEnvironment (project.environments[e]);
					return;
				}
			}
		}
	};

	/**
	 * Set project
	 *
	 * @param project
	 */
	$rootScope.selectProject = function (project) {
		$rootScope.currentProject = project;

		if (typeof project != 'undefined') {
			$rootScope.currentProjectId = project.id;
			$rootScope.availableEnvironments = project.environments;
		}
	};

	/**
	 * Set environment
	 *
	 * @param environment
	 * @param options
	 */
	$rootScope.selectEnvironment = function (environment, options) {
		if (typeof options == 'undefined')
			options = {};

		$rootScope.currentEnvironment = environment;

		if (options.hasOwnProperty ('redirectToTests')) {
			$state.go ('tests', {environmentId: environment.id});
		}
	};

	/**
	 * Setup environment and project only by environment (and/or project) ids.
	 *
	 * This method is intended for public usage.
	 *
	 * @param environmentId
	 * @param projectId
	 */
	$rootScope.setEnvironment = function (environmentId, projectId) {
		$rootScope.currentEnvironmentId = environmentId;
		$rootScope.currentProjectId = projectId;
		setProjectAndEnvironment ();
	};

	return self;
}]);
