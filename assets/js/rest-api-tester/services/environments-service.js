// var app = angular.module ('restApiTester');

window.app.service ('environmentsService', ['$http', '$q', function ($http, $q) {
	return {
		getOverview: function (projectId) {
			var d = $q.defer ();

			$http.get ('/api/v1/projects/' + projectId + '/environments').then (d.resolve, d.reject);

			return d.promise;
		},

		detail: function (environmentId) {
			var d = $q.defer ();

			var queryString = '?withMembers=1';

			$http.get ('/api/v1/environments/' + environmentId + queryString).then (d.resolve, d.reject);

			return d.promise;
		},

		create: function (projectId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/projects/' + projectId + '/environments', data).then (d.resolve, d.reject);

			return d.promise;
		},
		edit: function (environmentId, data) {
			var d = $q.defer ();

			// remove unwanted field
			delete data.teamMembers;

			$http.put ('/api/v1/environments/' + environmentId, data).then (d.resolve, d.reject);

			return d.promise;
		},

		delete: function (environmentId) {
			var d = $q.defer ();

			$http.delete ('/api/v1/environments/' + environmentId, {}).then (d.resolve, d.reject);

			return d.promise;
		},

		addUser: function (environmentId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/environments/' + environmentId+'/users', data).then (d.resolve, d.reject);

			return d.promise;
		},
		
		removeUser: function (environmentId, userId) {
			var d = $q.defer ();

			$http.delete ('/api/v1/environments/' + environmentId+'/users/'+userId, {}).then (d.resolve, d.reject);

			return d.promise;
		}
	}
}]);