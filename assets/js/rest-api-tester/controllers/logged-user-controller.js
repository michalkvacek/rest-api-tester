var app = angular.module ('restApiTester');

app.controller ('LoggedUserController', ['$scope', 'loginService', function ($scope, loginService) {
	$scope.data = ['Upravit', 'Tester', 'Vytvořit'];
}]);