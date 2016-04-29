var app = angular.module ('restApiTester');

app.service ('requestsService', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
	return {
		create: function (environmentId, data) {
			var d = $q.defer ();

			$http.post ('/api/v1/environments/' + environmentId + '/requests', data).then (function (response) {
				$rootScope.$broadcast ('requestCreated', response.data);
				
				return d.resolve (response);
			}, d.reject);

			return d.promise;
		}
	}
}]);