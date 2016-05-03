var app = angular.module ('restApiTester');

app.service ('loginService', ['$http', '$timeout', '$q', function ($http, $timeout, $q) {

	var lastAuth = null,
		identity = {};

	var periodicalLogin = function () {
		$timeout(periodicalLogin, 5*60*1000);

		var now = new Date ();

		if (now - lastAuth > 1 * 10 * 1000) {
			$http.get ('/api/v1/users/me').then (function (response) {
				if (response.status == 200) {
					identity = response.data;
					lastAuth = now;
					return true;

				} else {
					identity = {};
					localStorage.removeItem('auth_token');
					return false
				}
			});
		} else {

			identity.cas = new Date();


			return true;
		}
	};

	periodicalLogin();
	

	return {
		localAuth: function (data) {
			var d = $q.defer ();
			$http.post ('/api/v1/login', data).then (function (response) {

				console.log (response.data);

				localStorage.setItem ('auth_token', response.data.token);

				return d.resolve (response);
			}, d.reject);

			return d.promise;
		},
		isAuthenticated: function() {
			return localStorage.getItem('auth_token') != null;
		},
		getIdentity: function() {
			return identity;
		}
	}
}]);