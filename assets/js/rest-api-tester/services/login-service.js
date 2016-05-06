var app = angular.module ('restApiTester');

app.service ('loginService', ['$http', '$timeout', '$rootScope', '$translate', '$q', function ($http, $timeout, $rootScope, $translate, $q) {

	var lastAuth = null;
	$rootScope.identity = {};

	var periodicalLogin = function (withTimeout) {

		if (typeof withTimeout == 'undefined' || withTimeout)
			$timeout (periodicalLogin, 5 * 60 * 1000);

		var now = new Date ();

		if (now - lastAuth > 60 * 10 * 1000) {
			$http.get ('/api/v1/users/me').then (function (response) {
				if (response.status == 200) {
					$rootScope.identity = response.data;
					
					lastAuth = now;

					return true;
				} else {
					$rootScope.identity = {};
					localStorage.removeItem ('auth_token');

					return false
				}
			});
		} else {
			return true;
		}
	};

	periodicalLogin ();

	return {
		localAuth: function (data) {
			var d = $q.defer ();
			$http.post ('/api/v1/login', data).then (function (response) {
				localStorage.setItem ('auth_token', response.data.token);

				// set identity
				$rootScope.identity = response.data.user;

				// load angular localization and new language
				$.getScript( "/locales/i10l/angular_"+$rootScope.identity.language+".js");
				$translate.use($rootScope.identity.language);

				return d.resolve (response);
			}, d.reject);

			return d.promise;
		},
		isAuthenticated: function () {
			return localStorage.getItem ('auth_token') != null;
		}
	}
}]);