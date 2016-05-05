var app = angular.module ('restApiTester');

app.controller ('AuthenticationsController', ['$scope', 'authenticationsService', function ($scope, authenticationsService) {

	var self = this;
	self.overview = {};
	self.environmentId = {};
	self.formData = {type: 'base'};

	self.init = function (environmentId) {
		self.environmentId = environmentId;

		$scope.setEnvironment(environmentId);

		authenticationsService.overview (environmentId).then (function (response) {
			self.overview = response.data;
		});
	};

	self.delete = function (authenticationId) {
		authenticationsService.delete (self.environmentId, authenticationId).then (function (response) {
			self.init (self.environmentId);
		});
	};

	self.create = function () {
		authenticationsService.create (self.formData.environmentsId, self.formData).then (function (response) {
			self.init (self.formData.environmentId);

			self.manageAuth = false;
		});
	};

	self.edit = function () {
		authenticationsService.edit (self.formData.environmentsId, self.formData.id, self.formData).then (function (response) {
			self.init (self.formData.environmentsId);

			self.manageAuth = false;
		});
	};

	return self;
}]);