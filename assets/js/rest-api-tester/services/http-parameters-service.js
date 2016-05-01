var app = angular.module ('restApiTester');

app.service ('httpParametersService', ['$http', '$q', function ($http, $q) {
	return {
		overview: function (requestId) {
			var d = $q.defer ();

			$http.get ('/api/v1/requests/'+requestId+'/httpParameters').then (d.resolve, d.reject);

			return d.promise;
		},
		detail: function (requestId, parameterId) {
			var d = $q.defer ();

			$http.get ('/api/v1/requests/'+requestId+'/httpParameters/'+parameterId).then (d.resolve, d.reject);

			return d.promise;
		},
		edit: function (requestId, parameterId, data) {
			var d = $q.defer ();

			$http.put ('/api/v1/requests/'+requestId+'/httpParameters/'+parameterId, data).then (d.resolve, d.reject);

			return d.promise;
		},
		create: function (requestId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/requests/'+requestId+'/httpParameters', data).then (d.resolve, d.reject);

			return d.promise;
		},
		delete: function (requestId, parameterId) {
			var d = $q.defer ();

			$http.delete ('/api/v1/requests/'+requestId+'/httpParameters/'+parameterId).then (d.resolve, d.reject);

			return d.promise;
		}

	}
}]);