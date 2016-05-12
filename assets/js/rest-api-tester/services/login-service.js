// var app = angular.module ('restApiTester');

window.app.service ('loginService', ['$http', '$timeout', '$rootScope', '$translate', '$q', function ($http, $timeout, $rootScope, $translate, $q) {

	var lastAuth = null;
	$rootScope.identity = {};

	$rootScope.identityInitialized = false;

	$rootScope.reinitIdentity = function (callback) {
		$http.get ('/api/v1/users/me').then (function (response) {
			$rootScope.identityInitialized = true;
			$rootScope.identity = response.data;

			lastAuth = new Date ();
			
			if (typeof callback != 'undefined')
				callback();
			
		}, function (response) {

			if (response.status == 403) {
				$rootScope.identityInitialized = true;
				$rootScope.identity = {};
				localStorage.removeItem ('auth_token');
			}
		});
	};

	var periodicalLogin = function (withTimeout) {

		if (typeof withTimeout == 'undefined' || withTimeout)
			$timeout (periodicalLogin, 5 * 60 * 1000);

		var now = new Date ();

		if (now - lastAuth > 60 * 10 * 1000) {
			return $rootScope.reinitIdentity ();
		} else {
			return true;
		}
	};

	periodicalLogin ();

	var self = this;

	self.forgottenPassword = function (data) {
		var d = $q.defer ();
		$http.post ('/api/v1/forgottenPassword', data).then (d.resolve, d.reject);
		return d.promise;
	};

	self.localAuth = function (data) {
		var d = $q.defer ();
		$http.post ('/api/v1/login', data).then (function (response) {

			alert (JSON.stringify (response));

			localStorage.setItem ('auth_token', response.data.token);

			// set identity
			$rootScope.identity = response.data.user;

			// load angular localization and new language
			$.getScript ("/locales/i10l/angular_" + $rootScope.identity.language + ".js");
			$translate.use ($rootScope.identity.language);

			return d.resolve (response);
		}, d.reject);

		return d.promise;
	};

	self.isAuthenticated = function () {
		return $rootScope.identity.id != 'undefined' && localStorage.getItem ('auth_token') != null;
	};

	return self;

}]);