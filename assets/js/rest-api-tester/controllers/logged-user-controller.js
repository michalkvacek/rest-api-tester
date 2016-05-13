window.app.controller ('LoggedUserController', ['$rootScope', 'loginService', '$state', '$translate', 'notificationsService',
	function ($rootScope, loginService, $state, $translate, notificationsService) {
		$rootScope.logoutAndRedirect = function () {
			$rootScope.logout ();

			$state.go ('login');
		}
	}
]);