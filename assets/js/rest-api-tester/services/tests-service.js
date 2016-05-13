// var app = angular.module ('restApiTester');

window.app.service ('testsService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
	return {
		getOverview: function (environmentId) {
			var d = $q.defer ();

			$http.get ('/api/v1/environments/' + environmentId + '/tests').then (d.resolve, d.reject);

			return d.promise;
		},
		getStatistics: function (ageInDays, options) {
			var d = $q.defer ();

			var queryString = '?age=' + ageInDays;

			if (typeof options.environmentId != 'undefined')
				queryString += '&environmentId=' + options.environmentId;

			if (typeof options.testId != 'undefined') {
				queryString += '&testId=' + options.testId;
			}

			$http.get ('/api/v1/tests/statistics' + queryString).then (d.resolve, d.reject);

			return d.promise;
		},
		getDetail: function (testId) {
			var d = $q.defer ();

			$http.get ('/api/v1/tests/' + testId + '?withRequests=1&withHeaders=1&withResults=1').then (d.resolve, d.reject);

			return d.promise;
		},

		edit: function (testId, data) {
			var d = $q.defer ();

			if (data.runInterval == 'null')
				data.runInterval = null;

			$http.put ('/api/v1/tests/' + testId, data).then (d.resolve, d.reject);

			return d.promise;
		},

		schedule: function (testId, data) {
			var d = $q.defer ();

			if (data.runInterval == 'null')
				data.runInterval = null;

			$http.put ('/api/v1/tests/' + testId + '/schedule', data).then (d.resolve, d.reject);

			return d.promise;
		},

		runAll: function (environmentId) {
			var d = $q.defer ();

			$http.post ('/api/v1/environments/' + environmentId + '/runTests', {}).then (d.resolve, d.reject);

			return d.promise;
		},

		run: function (testId) {
			var d = $q.defer ();

			$http.post ('/api/v1/tests/' + testId + '/run', {}).then (d.resolve, d.reject);

			return d.promise;
		},

		create: function (environmentId, data) {
			var d = $q.defer ();

			if (data.runInterval == 'null')
				data.runInterval = null;

			$http.post ('/api/v1/environments/' + environmentId + '/tests', data).then (d.resolve, d.reject);

			return d.promise;
		},
		removeRequest: function (testId, requestId) {
			var d = $q.defer ();

			$http.delete ('/api/v1/tests/' + testId + '/requests/' + requestId, {}).then (d.resolve, d.reject);

			return d.promise;
		},

		assignRequest: function (testId, requestId) {
			var d = $q.defer ();

			$http.post ('/api/v1/tests/' + testId + '/requests/' + requestId, {}).then (function (response) {
					var eventData = {assignedToTest: {testsId: testId}};
					$rootScope.$broadcast ('addedRequestIntoTest', eventData);

					return d.resolve (response);
				},
				d.reject
			);

			return d.promise;
		},
	}

}]);