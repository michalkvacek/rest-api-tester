var app = angular.module ('restApiTester');

app.controller ('NotificationsController', ['$scope', '$location', function ($scope, $location) {

	var self = this;

	self.notificationsList = {};

	return self;
}]);