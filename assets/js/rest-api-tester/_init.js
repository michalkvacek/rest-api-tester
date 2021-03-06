window.app = angular.module ('restApiTester', ['ui.router', 'ui.gravatar', 'ngAnimate', 'ngSanitize', 'pascalprecht.translate']);

window.app.config (['$stateProvider', '$urlRouterProvider', '$httpProvider', '$translateProvider',
	function ($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider) {

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

		// translations
		$translateProvider.useStaticFilesLoader({
			prefix: 'locales/translation-',
			suffix: '.json'
		});
		$translateProvider.preferredLanguage('cs');
		$translateProvider.useSanitizeValueStrategy('escape');
		
		// routing
		$urlRouterProvider.otherwise ("/");

		$stateProvider.state ('auth', {
				abstract: true,
				template: '<div ui-view></div>',

				resolve: {
					auth: ['$q', 'loginService', '$state', '$timeout',
						function ($q, user, $state, $timeout) {
							if (user.isAuthenticated ()) {
								return $q.resolve ();
							} else {
								$timeout (function () {
									$state.go ('login')
								});
								return $q.reject ()
							}
						}]
				}
			}
		).state ('/', {
			url: "/",
			template: window.JST['assets/templates/homepage.html']
		}).state ('login', {
			url: "/login",
			template: window.JST['assets/templates/login.html']
		}).state ('registration', {
			url: "/registration",
			template: window.JST['assets/templates/registration.html']
		}).state ('projects', {
			parent: 'auth',
			url: '/projects',
			template: window.JST['assets/templates/projects.html']
		}).state ('projects_settings', {
			parent: 'auth',
			url: '/project/{projectId}/settings',
			template: window.JST['assets/templates/projectSettings.html']
		}).state ('environment_settings', {
			parent: 'auth',
			url: '/environments/{environmentId}/settings',
			template: window.JST['assets/templates/environmentSettings.html']
		}).state ('dashboard', {
			parent: 'auth',
			url: '/project/{projectId}/dashboard',
			template: window.JST['assets/templates/dashboard.html']
		}).state ('tests', {
			parent: 'auth',
			url: '/environment/{environmentId:int}/tests',
			template: window.JST['assets/templates/tests.html']
		}).state ('test_detail', {
			parent: 'auth',
			url: '/tests/{testId:int}',
			template: window.JST['assets/templates/test.html']
		}).state ('test_result', {
			parent: 'auth',
			url: '/tests/results/{testResultId:int}',
			template: window.JST['assets/templates/testResult.html']
		}).state ('request', {
			parent: 'auth',
			url: '/requests/:requestId',
			template: window.JST['assets/templates/request.html']
		}).state ('request_editor', {
			parent: 'auth',
			url: '/requests/:requestId/editor',
			template: window.JST['assets/templates/requestEditor.html']
		}).state ('user', {
			parent: 'auth',
			url: '/user',
			template: window.JST['assets/templates/user.html']
		});

	}]).run (function ($rootScope) {

	$rootScope.Object = Object;

	$rootScope.emptyObject = function (object) {

		// undefined object is probably also without data and therefore empty
		if (typeof object == 'undefined' || object == null)
			return true;

		return Object.keys (object).length == 0;
	};

	$rootScope.reinitDateTimePicker = function () {
		$ ('input[type=datetime]').fdatepicker ({
			pickTime: true,
			format: 'yyyy-mm-dd hh:ii'
		});
	};

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
			$rootScope.hideProjectInBreadcrumbs = false;
			$rootScope.currentTestResult = false;
		});

	$rootScope.$on ('$viewContentLoaded', function () {
		$ ('#loaded-view').foundation ();

		$ ('input[type=datetime]').fdatepicker ({
			pickTime: true,
			format: 'mm-dd-yyyy hh:ii',
		});
	});
}).directive ('modal', function () {
	return {
		restrict: 'E',
		scope: {show: '=show'},
		replace: true,
		transclude: true,
		link: function (scope, element, attrs) {
			scope.hideModal = function () {
				scope.show = false;
			};
		},
		template: "<div class='ng-modal' ng-show='show'>" +
		"<div class='reveal-modal-overlay' ng-click='hideModal()'></div>" +
		"<div class='reveal-modal'>" +
		"<div ng-transclude></div>" +
		'<button class="close-button" ng-click="hideModal()" type="button">&times;</button>' +
		"</div>" +
		"</div>"
	};
});