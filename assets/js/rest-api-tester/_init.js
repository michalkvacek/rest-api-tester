var app = angular.module ('restApiTester', ['ui.router']);

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
				},
				// requestError: function (rejection) {
				// 	// console.log('requestError');
				// 	// console.log(rejection);
				// },
				// response: function (config) {
				// 	// console.log('response');
				// 	// console.log(config);
				// },
				// responseError: function (neco) {
				// 	// console.log('responseError');
				// 	// console.log(neco);
				// }
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
		}).state ('test_detail', {
			url: '/tests/{testId:int}',
			template: window.JST['assets/templates/test.html'],
			controller: 'TestsController',
			controllerAs: 'controller'
		});
	}]).run (function ($rootScope) {
	$rootScope.$on ('$viewContentLoaded', function () {
		$ ('#loaded-view').foundation ();
	});
});