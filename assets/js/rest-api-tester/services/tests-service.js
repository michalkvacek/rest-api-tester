var app = angular.module ('restApiTester');

app.service ('testsService', ['$http', '$q', function ($http, $q) {
	return {
		getOverview: function (environmentId) {
			var d = $q.defer ();

			$http.get ('/api/v1/environments/' + environmentId + '/tests').then (d.resolve, d.reject);

			return d.promise;
		},
		getStatistics: function (ageInDays, options) {
			var d = $q.defer ();

			var queryString = '?age='+ageInDays;

			if (typeof options.environmentId != 'undefined')
				queryString += '&environmentId='+options.environmentId;

			if (typeof options.testId != 'undefined') {
				queryString += '&testId='+options.testId;
			}

			$http.get ('/api/v1/tests/statistics'+queryString).then (d.resolve, d.reject);

			return d.promise;
		},
		getDetail: function (testId) {
			var d = $q.defer ();

			$http.get ('/api/v1/tests/' + testId + '?withRequests=1&withHeaders=1&withResults=1').then (d.resolve, d.reject);

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
		
		edit: function (testId, data) {
			var d = $q.defer ();

			$http.put ('/api/v1/tests/'+testId, data).then (d.resolve, d.reject);

			return d.promise;
		},

		schedule: function (testId, data) {
			var d = $q.defer ();

			$http.put ('/api/v1/tests/'+testId+'/schedule', data).then (d.resolve, d.reject);

			return d.promise;
		},

		runAll: function (environmentId) {
			var d = $q.defer ();

			$http.post ('/api/v1/environments/'+environmentId+'/runTests', {}).then (d.resolve, d.reject);

			return d.promise;
		},
		
		run: function (testId) {
			var d = $q.defer ();

			$http.post ('/api/v1/tests/'+testId+'/run', {}).then (d.resolve, d.reject);

			return d.promise;
		},
		
		create: function (environmentId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/environments/' + environmentId + '/tests', data).then (d.resolve, d.reject);

			return d.promise;
		}
	}
}]);