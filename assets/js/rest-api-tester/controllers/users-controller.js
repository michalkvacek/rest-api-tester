var app = angular.module ('restApiTester');

app.controller ('UsersController', ['$scope', '$rootScope', 'usersService', function ($scope, $rootScope, usersService) {

	var self = this;
	self.profile = {};

	self.initProfile = function () {
		usersService.profile ().then (function (response) {
			self.profile = response.data;
		});
	};

	self.edit = function () {
		usersService.edit (self.profile).then (function (response) {
			$rootScope.identity = response.data;
		});
	};

	return self;
}]);