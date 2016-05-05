var app = angular.module ('restApiTester');

app.controller ('VersionsController', ['$scope', 'versionsService', function ($scope, versionsService) {

	var self = this;
	self.overview = {};
	self.projectId = {};
	self.formData = {};

	self.init = function (projectId, selectedVersion) {
		self.projectId = projectId;
		self.formData.versionsId = selectedVersion;

		versionsService.overview (projectId).then (function (response) {
			self.overview = response.data;
		});
	};

	self.delete = function (versionId) {
		versionsService.delete (self.projectId, versionId).then (function (response) {
			self.init (self.projectId);
		});
	};

	self.create = function () {
		versionsService.create (self.formData.projectsId, self.formData).then (function (response) {
			self.init (self.formData.projectsId);

			self.manageVersion = false;
		});
	};

	self.edit = function () {
		versionsService.edit (self.formData.projectsId, self.formData.id, self.formData).then (function (response) {
			self.init (self.formData.projectId);

			self.manageVersion = false;
		});
	};

	return self;
}]);