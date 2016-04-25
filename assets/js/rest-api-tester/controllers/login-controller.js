var app = angular.module ('restApiTester');

app.controller ('LoginController', ['$scope', 'loginService', '$window', function ($scope, login, $window) {

	$scope.formData = {};

	return {
		localAuth: function () {
			login.postLogin ($scope.formData).then (function (response) {
				alert (JSON.stringify (response));
			});
		}
	}
}]);