var app = angular.module ('restApiTester');

app.controller ('RequestsController', ['$scope', 'requestsService', 'testsService', '$stateParams', function ($scope, requestsService) {

	var self = this;

	$scope.requestId = null;
	self.formData = self.detail = {};

	// set some default values
	self.formData.httpMethod = 'GET';

	// prevent multiple loading (and reinitializing) the same models
	self.initiliazed = {
		detail: false,
		environmentOverview: false
	};

	self.initDetail = function (environmentId, testId, id) {

		if (self.initiliazed.detail == id)
			return;

		requestsService.detail (environmentId, testId, id).then (function (response) {
			self.detail[id] = response.data;
			self.initiliazed.detail = id;
		});
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