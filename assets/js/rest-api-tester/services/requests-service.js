// var app = angular.module ('restApiTester');

window.app.service ('requestsService', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
	return {
		detail: function (id, testId) {
			var d = $q.defer ();

			var queryString = '?withHeaders=1';
			queryString += "&withVersion=1";
			queryString += "&withAuth=1";
			queryString += "&withTests=1";
			queryString += "&withEnvironment=1";
			queryString += "&withHttpParams=1";

			if (typeof testId != 'undefined')
				queryString += '&testsId=' + testId;

			$http.get ('/api/v1/requests/' + id + queryString).then (d.resolve, d.reject);

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

		edit: function (requestId, data) {
			var d = $q.defer ();

			$http.put ('/api/v1/requests/' + requestId, data).then (d.resolve, d.reject);

			return d.promise;
		},

		lastResponse: function (requestId) {
			var d = $q.defer ();

			$http.get ('/api/v1/requests/' + requestId + "/lastResponse").then (d.resolve, d.reject);

			return d.promise;
		},

		create: function (environmentId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/environments/' + environmentId + '/requests', data).then (function (response) {
				$rootScope.$broadcast ('addedRequestIntoTest', response.data);

				return d.resolve (response);
			}, d.reject);

			return d.promise;
		},
		delete: function (requestId) {
			var d = $q.defer ();

			$http.delete ('/api/v1/requests/' + requestId).then (d.resolve, d.reject);

			return d.promise;
		}
	}
}]);