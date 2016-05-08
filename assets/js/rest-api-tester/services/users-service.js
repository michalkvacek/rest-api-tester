// var app = angular.module ('restApiTester');

window.app.service ('usersService', ['$http', '$q', function ($http, $q) {
	var self = this;

	self.profile = function () {
		var d = $q.defer ();
		$http.get ('/api/v1/users/me').then (d.resolve, d.reject);
		return d.promise;
	};

	self.edit = function (data) {
		var d = $q.defer ();
		$http.put ('/api/v1/users/me', data).then (d.resolve, d.reject);
		return d.promise;
	};

	return self;
}]);