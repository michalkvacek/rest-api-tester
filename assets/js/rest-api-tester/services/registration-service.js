// var app = angular.module ('restApiTester');

window.app.service ('registrationService', ['$http', '$q', function ($http, $q) {
	return {
		newLocalUser: function (data) {
			var d = $q.defer ();
			$http.post ('/api/v1/registration', data).then (d.resolve, d.reject);
			return d.promise;
		}
	}
}]);