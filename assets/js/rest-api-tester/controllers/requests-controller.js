var app = angular.module ('restApiTester');

app.controller ('RequestsController', ['$scope', 'requestsService', '$stateParams', function ($scope, requestsService, $stateParams) {

	var self = this;

	$scope.requestId = null;
	self.lastResponse = self.current = self.formData = self.detail = {};

	// set some default values
	self.formData.httpMethod = 'GET';

	// prevent multiple loading (and reinitializing) the same models
	self.initiliazed = {
		detail: false,
		environmentOverview: false
	};

	self.initDetail = function (id, testId) {
		
		if (typeof id == 'undefined') 
			id = $stateParams.requestId;

		if (self.initiliazed.detail == id)
			return;

		requestsService.detail (id, testId).then (function (response) {
			self.detail[id] = response.data;
			self.current = self.detail[id];
			self.initiliazed.detail = id;
		});
	};

	self.initLastResponse = function(requestId) {
		if (typeof requestId == 'undefined')
			requestId = $stateParams.requestId;

		requestsService.lastResponse(requestId).then(function (response) {
			self.lastResponse = response.data;
		})
	};

	self.initEnvironmentOverview = function (environmentId, options) {

		if (self.initiliazed.environmentOverview)
			return;

		if (typeof options == 'undefined') 
			options = {};

		requestsService.overview (environmentId, options).then (function (response) {
			self.environmentRequests = response.data;
			self.initiliazed.environmentOverview = true;
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

		requestsService.create (environmentId, self.formData).then (function (response) {
			$ ('#new-request-window').foundation ('close');
		});
	};

	return self;
}]);