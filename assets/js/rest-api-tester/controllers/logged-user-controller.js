var app = angular.module ('restApiTester');

app.controller ('LoggedUserController', ['$scope', '$location', 'loginService', function ($scope, $location, loginService) {

	var self = this;

	self.hasAvatar = true;
	self.avatar = 'https://placeholdit.imgix.net/~text?txtsize=10&txt=80%C3%9780&w=80&h=80';
	self.name = "Lorem Ipsum";

	return self;
}]);