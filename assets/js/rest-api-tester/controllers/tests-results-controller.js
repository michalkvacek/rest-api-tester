var app = angular.module ('restApiTester');

app.controller ('TestsResultsController', ['$scope', '$location', function ($scope, $location) {

	var self = this;
	
	self.results = [];
	
	
	return self;
}]);