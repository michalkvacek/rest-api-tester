var app = angular.module ('restApiTester');

app.service ('versionsService', ['$http', '$q', function ($http, $q) {
	return {
		overview: function (projectId) {
			var d = $q.defer ();

			$http.get ('/api/v1/projects/'+projectId+'/versions').then (d.resolve, d.reject);

			return d.promise;
		},
		detail: function (projectId, versionId) {
			var d = $q.defer ();

			$http.get ('/api/v1/projects/'+projectId+'/versions/'+versionId).then (d.resolve, d.reject);

			return d.promise;
		},
		edit: function (projectId, versionId, data) {
			var d = $q.defer ();

			$http.put ('/api/v1/projects/'+projectId+'/versions/'+versionId, data).then (d.resolve, d.reject);

			return d.promise;
		},
		create: function (projectId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/projects/'+projectId+'/versions/', data).then (d.resolve, d.reject);

			return d.promise;
		},
		delete: function (projectId, versionId) {
			var d = $q.defer ();

			$http.delete ('/api/v1/projects/'+projectId+'/versions/'+versionId).then (d.resolve, d.reject);

			return d.promise;
		}

	}
}]);