var app = angular.module ('restApiTester');

app.controller ('LoginController', ['$scope', '$rootScope', '$location', 'loginService', function ($scope, $rootScope, $location, loginService) {

	var self = this;

	self.formData = {};

	self.localAuth = function (options) {
		if (typeof options == "undefined")
			options = {};

		loginService.localAuth (self.formData).then (function (response) {
			if (response.status != 200) {
				alert ('login se nepovedl');
				return;
			}

			if (options.redirect)
				$location.path ('/projects');

			$rootScope.refreshProjectOverview ();
		});
	};

	return self;
}]);