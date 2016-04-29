var app = angular.module ('restApiTester');

app.controller ('RequestsController', ['$scope', 'requestsService', 'testsService', '$stateParams', function ($scope, requestsService) {

	var self = this;

	$scope.requestId = null;
	self.formData = self.detail = {};

	self.initDetail = function (environmentId, testId, id) {
		requestsService.detail(environmentId, testId, id).then(function (response) {
			self.detail[id] = response.data;
		});
	};


	self.setRequestId = function (id) {
		$scope.requestId = id;
	};
	
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