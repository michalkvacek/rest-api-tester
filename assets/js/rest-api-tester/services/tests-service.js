var app = angular.module ('restApiTester');

app.service ('testsService', ['$http', '$q', function ($http, $q) {
	return {
		getOverview: function (environmentId) {
			var d = $q.defer ();

			$http.get ('/api/v1/environments/' + environmentId + '/tests').then (d.resolve, d.reject);

			return d.promise;
		},
		getStatistics: function (environmentId) {
			var d = $q.defer ();

			$http.get ('/api/v1/environments/' + environmentId + '/statistics').then (d.resolve, d.reject);

			return d.promise;
		},
		getDetail: function (testId) {
			var d = $q.defer ();

			$http.get ('/api/v1/tests/' + testId + '?withRequests=1').then (d.resolve, d.reject);

			return d.promise;
		},
		assignRequest: function (testId, requestIds) {
			var d = $q.defer ();

			var data = {
				testId: testId,
				requestIds: requestIds
			};
			
			$http.post ('/api/v1/tests/' + testId + '/assignRequests', data).then (function (response) {
					response.data.assignedToTest.testsId = testId;
					$rootScope.$broadcast ('addedRequestIntoTest', response.data);

					return d.resolve (response);
				},
				d.reject
			);

			return d.promise;
		},
		create: function (environmentId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/environments/' + environmentId + '/tests', data).then (d.resolve, d.reject);

			return d.promise;
		}
	}
}]);