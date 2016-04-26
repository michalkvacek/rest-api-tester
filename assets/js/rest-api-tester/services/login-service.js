var app = angular.module ('restApiTester');

app.service ('loginService', ['$http', '$q', function ($http, $q) {
	return {
		'postLogin': function (data) {
			var defer = $q.defer ();
			$http.post ('/api/v1/login', data).success (function (data) {
				localStorage.setItem ('auth_token', data.token);

				// redirect to list of projects

				return defer.resolve (data);
			}).error (function (err) {
				console.error (err);
				return defer.reject (err);
			});

			return defer.promise;
		}
	}
}]);