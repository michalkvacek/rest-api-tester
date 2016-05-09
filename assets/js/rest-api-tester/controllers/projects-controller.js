// var app = angular.module ('restApiTester');
window.app.controller ('ProjectsController', ['$rootScope', '$state', '$stateParams', '$translate', 'notificationsService', 'projectsService',
	function ($rootScope, $state, $stateParams, $translate, notificationsService, projectsService) {
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
		self.initOverview = function (selectedProjectId) {

			if (typeof selectedProjectId != 'undefined')
				$rootScope.setEnvironment (undefined, selectedProjectId);

			projectsService.getOverview ().then (function (response) {
				self.overview = response.data.managedProjects;

				// fire event to notify any listeners that project overview was re/loaded
				$rootScope.$broadcast ('projectOverviewLoaded');
			}, function (response) {
				$translate ('Nelze načíst seznam projektů. Stavový kód odpovědi: :statusCode', {statusCode: response.status}).then (function (translation) {
					notificationsService.push ('alert', $translate.instant (translation));
				});
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

				self.detail = response.data;
				self.formData = angular.copy (response.data);

				// update breadcrumbs
				if (updateBreadcrumbs)
					$translate ('Nastavení').then (function (settings) {
						$rootScope.breadcrumbs = [{
							label: settings,
							href: $state.href ('project_settings', {projectId: response.data.id})
						}];
					});
			}, function (response) {
				switch (response.status) {
					case 404:
						$translate ('Požadovaný project neexistuje. Vyberte prosím jiný.').then (function (translation) {
							notificationsService.push ('alert', $translate.instant (translation));
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
		 * Create new project
		 */
		self.create = function () {
			projectsService.create (self.formData).then (function (response) {
				self.initOverview ();
				$rootScope.reinitIdentity ();
				self.newProjectWindow = false;
			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
			});
		};

		/**
		 * Update current project
		 */
		self.edit = function () {

			// check if user inserted project name
			if (typeof self.formData.name == 'undefined' || self.formData.name == '')
				return;

			// ignore not-changed form
			if (self.formData.name == self.detail.name && self.formData.description == self.detail.description)
				return;

			projectsService.edit (self.formData.id, self.formData).then (function (response) {

				self.loadDetail ();
				self.initOverview (self.formData.id);

				$translate ('Úspěšně uloženo.').then (function (translation) {
					notificationsService.push ('success', translation);
				});
			}, function (response) {
				switch (response.status) {
					case 403:
						$translate ('Pro úpravu projektu nemáte dostatečné oprávnění.').then (function (translation) {
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
