var app = angular.module ('restApiTester');

app.controller ('LoginController', ['$scope', '$location', 'loginService', function ($scope, $location, loginService) {

	var self = this;

	self.formData = {};

	self.localAuth = function (options) {

		if (typeof options == "undefined")
			options = {};

		loginService.localAuth (self.formData).then (function (response) {
			if (options.redirect)
				$location.path ('/projects');
		}, function (err) {
			console.error(err);
		});
	};

	return self;
}]);