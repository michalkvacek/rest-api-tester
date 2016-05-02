var app = angular.module ('restApiTester');

app.service ('testsResultsService', ['$http', '$q', function ($http, $q) {
	return {
		getStatistics: function (testResultId) {
			var d = $q.defer ();

			$http.get ('/api/v1/tests/statistics?testResultId=' + testResultId).then (d.resolve, d.reject);

			return d.promise;
		},

		getOverview: function (ageInHours, projectId) {
			var d = $q.defer ();

			if (typeof  ageInHours == 'undefined')
				ageInHours = 6;
			
			var queryString = '?age='+ageInHours;
			
			if (typeof projectId != 'undefined')
				queryString += '&projectId='+projectId;
			
			$http.get ('/api/v1/testResults'+queryString).then (d.resolve, d.reject);

			return d.promise;
		},

		getDetail: function (testResultId) {
			var d = $q.defer ();

			$http.get ('/api/v1/testResults/' + testResultId).then (d.resolve, d.reject);

			return d.promise;
		}

	};
}]);