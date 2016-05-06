var app = angular.module ('restApiTester');

app.controller ('UsersController', ['$scope', '$rootScope', '$translate', 'usersService', function ($scope, $rootScope, $translate, usersService) {

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

			$.getScript( "/locales/i10l/angular_"+$rootScope.identity.language+".js");
			$translate.use($rootScope.identity.language);

		});
	};

	return self;
}]);