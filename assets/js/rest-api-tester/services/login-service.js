var app = angular.module ('restApiTester');

app.service ('loginService', ['$http', '$q', function ($http, $q) {
	return {
		localAuth: function (data) {
			var d = $q.defer ();
			$http.post ('/api/v1/login', data).then (function (response) {

				console.log(response.data);

				localStorage.setItem ('auth_token', response.data.token);

				return d.resolve (response);
			}, d.reject);

			return d.promise;
		}
	}
}]);