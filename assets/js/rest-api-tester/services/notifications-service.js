var app = angular.module ('restApiTester');

app.service ('notificationsService', ['$rootScope', function ($rootScope) {
	$rootScope.globalNotifications = [];

	/**
	 * Delete all notifications
	 */
	$rootScope.hideAllNotifications = function () {
		$rootScope.globalNotifications = [];
	};

	/**
	 * Delete only specified notification
	 *
	 * @param index index in array
	 */
	$rootScope.hideNotification = function (index) {
		if ($rootScope.globalNotifications[index]) {
			var notifications = $rootScope.globalNotifications;

			// move all notifications to previous index
			for (var i = index; i < notifications.length-1; i++) {
				notifications[i] = notifications[i+1];
			}
			
			// remove last item - is udplicated
			$rootScope.globalNotifications = notifications.slice(0, notifications.length - 1);
		}
	};

	var self = this;

	/**
	 * Display new notification
	 *
	 * @param type
	 * @param content
	 */
	self.push = function (type, content) {
		$rootScope.globalNotifications.push ({
			time: Date.now (),
			type: type,
			content: content
		});
	};

	return self;
}]);