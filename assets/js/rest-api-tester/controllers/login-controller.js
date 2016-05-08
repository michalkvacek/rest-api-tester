// var app = angular.module ('restApiTester');

window.app.controller ('LoginController', ['$scope', '$rootScope', '$location', '$translate', 'notificationsService', 'loginService',
	function ($scope, $rootScope, $location, $translate, notificationsService, loginService) {

		var self = this;

		self.formData = {};

		/**
		 * Login user with local credentials
		 *
		 * @param options
		 */
		self.localAuth = function (options) {
			if (typeof options == "undefined")
				options = {};

			loginService.localAuth (self.formData).then (function (response) {
				if (response.status != 200) {
					$translate ('Přihlášení selhalo').then (function (translation) {
						notificationsService.push ('alert', translation);
					});

					return;
				}

				if (options.redirect)
					$location.path ('/projects');

				$rootScope.refreshProjectOverview ();
			});
		};

		return self;
	}]);