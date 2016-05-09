window.app.controller ('HomepageController', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {

	var self = this;
	
	self.checkLoggedUser = function () {
		if ($rootScope.identity.id) {
			$state.go('projects');
		}
	};

	return self;
	
}]);