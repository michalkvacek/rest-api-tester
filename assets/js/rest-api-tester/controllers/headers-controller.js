var app = angular.module ('restApiTester');

app.controller ('HeadersController', ['$scope', '$stateParams', 'headersService', function ($scope, $stateParams, headersService) {

	var self = this;
	
	self.formData = {};
	
	self.openEditWindow = function (headerId) {
		
	};
	
	self.edit = function (headerId) {
		
	};

	self.newHeaderWindow = function (options) {
		
		if (options.testId)
			self.formData.testsId = options.testId;

		$ ('#new-assertion').foundation ('open');
	};

	self.create = function (data) {

		headersService.create (self.formData).then (function (response) {
			self.initRequestAssertions (self.requestId);

			$ ('#new-assertion').foundation ('close');
		})
	};
	
	return self;
}]);