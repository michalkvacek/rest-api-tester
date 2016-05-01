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
		versionsService.create (self.projectId, self.formData).then (function (response) {
			self.init (self.projectId);

			$ ('#new-version').foundation ('close');
		});
	};

	self.openEditWindow = function (versionId, projectId) {
		self.projectId = projectId;
		self.versionId = versionId;
		
		versionsService.detail (projectId, versionId).then (function (response) {
			self.formData = response.data;

			$ ('#edit-version').foundation ('open');
		});
	};

	self.edit = function () {
		versionsService.edit (self.projectId, self.versionId, self.formData).then (function (response) {
			self.init (self.projectId);

			$ ('#edit-version').foundation ('close');
		});
	};

	return self;
}]);