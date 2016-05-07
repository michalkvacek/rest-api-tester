var app = angular.module ('restApiTester');

app.service ('headersService', ['$http', '$q', function ($http, $q) {
	return {
		overview: function (filter) {
			var d = $q.defer ();
			var queryString = '?';
			for (property in filter) {
				queryString += property + "=" + filter[property] + "&";
			}

			$http.get ('/api/v1/headers' + queryString).then (d.resolve, d.reject);

			return d.promise;
		},
		detail: function (headerId) {
			var d = $q.defer ();

			$http.get ('/api/v1/headers/' + headerId).then (d.resolve, d.reject);

			return d.promise;
		},
		edit: function (headerId, data) {
			var d = $q.defer ();

			data.name = data.name.replace(/ /g, '-');

			$http.put ('/api/v1/headers/' + headerId, data).then (d.resolve, d.reject);

			return d.promise;
		},
		create: function (data) {
			var d = $q.defer ();

			data.name = data.name.replace(/ /g, '-');

			$http.post ('/api/v1/headers', data).then (d.resolve, d.reject);

			return d.promise;
		},
		delete: function (headerId) {
			var d = $q.defer ();

			$http.delete ('/api/v1/headers/' + headerId).then (d.resolve, d.reject);

			return d.promise;
		}

	}
}]);