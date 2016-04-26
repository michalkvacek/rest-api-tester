var app = angular.module ('restApiTester', ['ui.router']);

app.config (['$stateProvider', '$urlRouterProvider', '$httpProvider',
	function ($stateProvider, $urlRouterProvider, $httpProvider) {

		$httpProvider.interceptors.push (function ($q) {
			return {
				'request': function (config) {

					var token = localStorage.getItem ('auth_token');

					if (token) {
						config.headers['Authorization'] = 'Bearer ' + token;
					} else alert ('nemam token');

					return config;
				}
			};
		});

		// routing
		$urlRouterProvider.otherwise ("/");

		$stateProvider.state ('/', {
			url: "/",
			template: window.JST['assets/templates/homepage.html']
		}).state ('projects', {
			url: '/projects',
			template: window.JST['assets/templates/projects.html'],
			controller: 'ProjectsController'
		});
	}]).run (function ($rootScope) {
	$rootScope.$on ('$viewContentLoaded', function () {
		$ (document).foundation ();
	});
});