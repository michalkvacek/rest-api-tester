var app = angular.module ('restApiTester');

app.service ('requestsService', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
	return {
		detail: function (environmentsId, testId, id) {
			var d = $q.defer ();

			$http.get ('/api/v1/environments/' + environmentsId + '/requests/' + id + '?withAssertions=1&withHeaders=1&testsId=' + testId).then (d.resolve, d.reject);

			return d.promise;
		},

		overview: function (environmentsId, options) {
			var d = $q.defer ();

			var queryString = '?';

			if (options.ignoreTest) {
				queryString += 'ignoreTest=' + options.ignoreTest;
			}

			$http.get ('/api/v1/environments/' + environmentsId + '/requests' + queryString).then (d.resolve, d.reject);

			return d.promise;
		},

		create: function (environmentId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/environments/' + environmentId + '/requests', data).then (function (response) {
				$rootScope.$broadcast ('addedRequestIntoTest', response.data);

				return d.resolve (response);
			}, d.reject);

			return d.promise;
		}
	}
}]);