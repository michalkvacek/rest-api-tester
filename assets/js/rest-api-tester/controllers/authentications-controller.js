var app = angular.module ('restApiTester');

app.controller ('AuthenticationsController', ['$scope', 'authenticationsService', function ($scope, authenticationsService) {

	var self = this;
	self.overview = {};
	self.environmentId = {};
	self.formData = {type: 'base'};

	self.init = function (environmentId) {
		self.environmentId = environmentId;

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
		authenticationsService.create (self.environmentId, self.formData).then (function (response) {
			self.init (self.environmentId);

			$ ('#new-authentication').foundation ('close');
		});
	};

	self.openEditWindow = function (authenticationId, environmentId) {
		self.environmentId = environmentId;
		self.authenticationId = authenticationId;

		authenticationsService.detail (environmentId, authenticationId).then (function (response) {
			self.formData = response.data;

			$ ('#edit-authentication').foundation ('open');
		});
	};

	self.edit = function () {
		authenticationsService.edit (self.environmentId, self.authenticationId, self.formData).then (function (response) {
			self.init (self.environmentId);

			$ ('#edit-authentication').foundation ('close');
		});
	};

	return self;
}]);