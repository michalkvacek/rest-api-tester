var app = angular.module ('restApiTester', ['ui.router']);

app.config (['$stateProvider', '$urlRouterProvider', '$httpProvider',
	function ($stateProvider, $urlRouterProvider, $httpProvider) {

		// interceptor
		$httpProvider.interceptors.push (function ($q) {
			return {
				'request': function (config) {

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

		$stateProvider.state ('/', {
			url: "/login",
			template: window.JST['assets/templates/homepage.html']
		}).state ('projects', {
			url: '/projects',
			template: window.JST['assets/templates/projects.html'],
			controller: 'ProjectsController',
			controllerAs: 'controller'
		}).state ('projects_settings', {
			url: '/project/{projectId}/settings',
			template: window.JST['assets/templates/homepage.html'],
			controller: 'ProjectsController',
			controllerAs: 'controller'
		}).state ('dashboard', {
			url: '/project/{projectId}/dashboard',
			template: window.JST['assets/templates/dashboard.html'],
			controller: 'DashboardController',
			controllerAs: 'controller'
		}).state ('tests', {
			url: '/environment/{environmentId:int}/tests',
			template: window.JST['assets/templates/tests.html'],
			controller: 'TestsController',
			controllerAs: 'controller'
		});
	}]).run (function ($rootScope) {
	$rootScope.$on ('$viewContentLoaded', function () {
		$ (document).foundation ();
	});
});