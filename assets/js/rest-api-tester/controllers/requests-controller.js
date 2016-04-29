var app = angular.module ('restApiTester');

app.controller ('RequestsController', ['$scope', 'requestsService', 'testsService', '$stateParams', function ($scope, requestsService, testsService, $stateParams) {

	var self = this;

	self.formData = {};

	self.create = function () {

		var environmentId = self.formData.environmentsId || $scope.environmentId;
		var testId = self.formData.testsId || $scope.testId;
		
		self.formData.environmentsId = environmentId;
		self.formData.testsId = testId;

		alert (JSON.stringify (self.formData));

		requestsService.create (environmentId, self.formData).then (function (response) {
			$ ('#new-request-window').foundation ('close');
		});
	};

	return self;
}]);