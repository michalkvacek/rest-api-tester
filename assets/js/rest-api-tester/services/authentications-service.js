var app = angular.module ('restApiTester');

app.service ('authenticationsService', ['$http', '$q', function ($http, $q) {
	return {
		overview: function (environmentId) {
			var d = $q.defer ();

			$http.get ('/api/v1/environments/' + environmentId + '/auths').then (d.resolve, d.reject);

			return d.promise;
		},
		detail: function (environmentId, authId) {
			var d = $q.defer ();

			$http.get ('/api/v1/environments/' + environmentId + '/auths/' + authId).then (d.resolve, d.reject);

			return d.promise;
		},
		edit: function (environmentId, authId, data) {
			var d = $q.defer ();

			$http.put ('/api/v1/environments/' + environmentId + '/auths/' + authId, data).then (d.resolve, d.reject);

			return d.promise;
		},
		create: function (environmentId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/environments/' + environmentId + '/auths/', data).then (d.resolve, d.reject);

			return d.promise;
		},
		delete: function (environmentId, authId) {
			var d = $q.defer ();

			$http.delete ('/api/v1/environments/' + environmentId + '/auths/' + authId).then (d.resolve, d.reject);

			return d.promise;
		}

	}
}]);