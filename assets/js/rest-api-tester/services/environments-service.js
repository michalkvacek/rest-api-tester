var app = angular.module ('restApiTester');

app.service ('environmentsService', ['$http', '$q', function ($http, $q) {
	return {
		getOverview: function (projectId) {
			var d = $q.defer ();

			$http.get ('/api/v1/projects/'+projectId+'/environments').then (d.resolve, d.reject);

			return d.promise;
		},
		create: function (projectId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/projects/'+projectId+'/environments', data).then (d.resolve, d.reject);

			return d.promise;
		},
		edit: function (environmentId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/environments/'+environmentId, data).then (d.resolve, d.reject);

			return d.promise;
		},

		delete: function (environmentId) {
			var d = $q.defer ();

			$http.delete ('/api/v1/environments/'+environmentId, {}).then (d.resolve, d.reject);

			return d.promise;
		}
	}
}]);