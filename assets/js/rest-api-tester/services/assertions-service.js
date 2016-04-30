var app = angular.module ('restApiTester');

app.service ('assertionsService', ['$http', '$q', function ($http, $q) {
	var self = this;

	self.getTypes = function () {
		var d = $q.defer ();

		$http.get ('/api/v1/assertions/types').then (d.resolve, d.reject);

		return d.promise;
	};

	self.getAssertions = function (requestId) {
		var d = $q.defer ();

		$http.get ('/api/v1/requests/'+requestId+'/assertions').then (d.resolve, d.reject);

		return d.promise;
	};

	self.getDetail = function (assertionId) {
		var d = $q.defer ();

		$http.get ('/api/v1/assertions/'+assertionId).then (d.resolve, d.reject);

		return d.promise;
	};

	self.edit = function (assertionId, data) {
		var d = $q.defer ();

		$http.put ('/api/v1/assertions/'+assertionId, data).then (d.resolve, d.reject);

		return d.promise;
	};

	self.create = function (requestId, data) {
		var d = $q.defer ();

		$http.post ('/api/v1/request/'+requestId+'/assertions', data).then (d.resolve, d.reject);

		return d.promise;
	};

	self.delete = function (assertionId) {
		var d = $q.defer ();

		$http.delete ('/api/v1/assertions/'+assertionId).then (d.resolve, d.reject);

		return d.promise;
	};

	return self;
}]);