var app = angular.module ('restApiTester');

app.service ('notificationsService', ['$rootScope', function ($rootScope) {
	$rootScope.globalNotifications = [];

	$rootScope.hideAllNotifications = function () {
		$rootScope.globalNotifications = [];
	};
	
	var self = this;

	self.push = function (type, content) {
		$rootScope.globalNotifications.push ({
			time: Date.now (),
			type: type,
			content: content
		});
	};

	return self;
}]);