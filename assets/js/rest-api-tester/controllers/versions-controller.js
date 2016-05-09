// var app = angular.module ('restApiTester');

window.app.controller ('VersionsController', ['$scope', 'versionsService', function ($scope, versionsService) {

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
		}, function (response) {
			switch (response.status) {
				case 403:
					$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
					break;

				default:
					$translate ('Nelze vykonat požadavek').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
					break;
			}
		});
	};

	self.create = function () {
		versionsService.create (self.formData.projectsId, self.formData).then (function (response) {
			self.init (self.formData.projectsId);

			self.manageVersion = false;
		}, function (response) {
			switch (response.status) {
				case 403:
					$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
					break;

				default:
					$translate ('Nelze vykonat požadavek').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
					break;
			}
		});
	};

	self.edit = function (projectId) {

		if (!self.formData.projectsId)
			self.formData.projectsId = projectId;

		versionsService.edit (self.formData.projectsId, self.formData.id, self.formData).then (function (response) {
			self.init (self.formData.projectsId);

			self.manageVersion = false;
		}, function (response) {
			switch (response.status) {
				case 403:
					$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
					break;

				default:
					$translate ('Nelze vykonat požadavek').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
					break;
			}
		});
	};

	return self;
}]);