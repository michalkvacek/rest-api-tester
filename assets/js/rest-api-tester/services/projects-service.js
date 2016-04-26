var app = angular.module ('restApiTester');

app.service ('projectsService', ['$http', '$q', function ($http, $q) {
	return {
		getOverview: function () {
			var d = $q.defer ();

			$http.get ('/api/v1/projects').then (d.resolve, d.reject);

			return d.promise;
		},
		'create': function (data) {
			var d = $q.defer ();

			$http.post ('/api/v1/projects', data).then (d.resolve, d.reject);

			return d.promise;
		}
	}
}]);