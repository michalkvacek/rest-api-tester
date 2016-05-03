var app = angular.module ('restApiTester', ['ui.router', 'ui.gravatar']);

app.config (['$stateProvider', '$urlRouterProvider', '$httpProvider',
	function ($stateProvider, $urlRouterProvider, $httpProvider) {

		// interceptor
		$httpProvider.interceptors.push (function ($q) {
			return {
				request: function (config) {

					var token = localStorage.getItem ('auth_token');

					if (token) {
						config.headers['Authorization'] = 'Bearer ' + token;
					}

					return config;
				}
			};
		});

		// routing
		$urlRouterProvider.otherwise ("/");

		// login
		// http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication

		$stateProvider.state ('/', {
			url: "/",
			template: window.JST['assets/templates/homepage.html']
		}).state ('login', {
			url: "/login",
			template: window.JST['assets/templates/login.html']
		}).state ('registration', {
			url: "/registration",
			template: window.JST['assets/templates/registration.html']
		}).state ('projects', {
			url: '/projects',
			template: window.JST['assets/templates/projects.html']
		}).state ('projects_settings', {
			url: '/project/{projectId}/settings',
			template: window.JST['assets/templates/projectSettings.html']
		}).state ('environment_settings', {
			url: '/environments/{environmentId}/settings',
			template: window.JST['assets/templates/environmentSettings.html']
		}).state ('dashboard', {
			url: '/project/{projectId}/dashboard',
			template: window.JST['assets/templates/dashboard.html']
		}).state ('tests', {
			url: '/environment/{environmentId:int}/tests',
			template: window.JST['assets/templates/tests.html']
		}).state ('test_detail', {
			url: '/tests/{testId:int}',
			template: window.JST['assets/templates/test.html']
		}).state ('test_result', {
			url: '/tests/results/{testResultId:int}',
			template: window.JST['assets/templates/testResult.html']
		}).state ('request', {
			url: '/requests/:requestId',
			template: window.JST['assets/templates/request.html']
		}).state ('request_editor', {
			url: '/requests/:requestId/editor',
			template: window.JST['assets/templates/requestEditor.html']
		});
	}]).run (function ($rootScope) {

	$rootScope.openTab = function (tabsContainer, tab) {

		var tabButtons = tabsContainer + ' .tabs-title';
		var pressedButton = tab + "-title";

		$ (tabButtons).removeClass ('is-active');
		$ (tabButtons + ' a').attr ("aria-selected", false);
		$ (pressedButton).addClass ('is-active');
		$ (pressedButton + " a").attr ("aria-selected", true);

		$ (tabsContainer + ' .tabs-panel').removeClass ('is-active');
		$ (tab).addClass ('is-active');
	};

	$rootScope.$on ('$stateChangeStart',
		function (event, toState, toParams, fromState, fromParams, options) {
			$rootScope.currentEnvironment = {};
			$rootScope.currentProject = {};
			$rootScope.currentProjectId = {};
			$rootScope.availableEnvironments = {};
			$rootScope.currentEnvironmentId = {};
			$rootScope.breadcrumbs = {};
			$rootScope.enableLoadingDashboardTests = false;
		});

	$rootScope.$on ('$viewContentLoaded', function () {
		$ ('#loaded-view').foundation ();
	});
});