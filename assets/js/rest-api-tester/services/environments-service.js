var app = angular.module ('restApiTester');

app.service ('environmentsService', ['$http', '$q', function ($http, $q) {
	return {
		getOverview: function (projectId) {
			var d = $q.defer ();

			$http.get ('/api/v1/projects/'+projectId+'/environments').then (d.resolve, d.reject);

			return d.promise;
		},
		getStatistics: function (environmentId, ageInDays) {
			var d = $q.defer ();

			$http.get ('/api/v1/environments/'+environmentId+'/statistics?age='+ageInDays).then (d.resolve, d.reject);

			return d.promise;
		},
		create: function (projectId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/projects/'+projectId+'/environments', data).then (d.resolve, d.reject);

			return d.promise;
		}
	}
}]);