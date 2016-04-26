var app = angular.module ('restApiTester');

app.controller ('LoginController', ['$scope', 'loginService', '$location', function ($scope, login, $location) {

	$scope.formData = {};

	return {
		localAuth: function () {
			login.postLogin ($scope.formData).then (function (response) {
				$location.path('/projects');
			});
		}
	}
}]);