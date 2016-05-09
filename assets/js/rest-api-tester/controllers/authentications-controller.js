// var app = angular.module ('restApiTester');

window.app.controller ('AuthenticationsController', ['$scope', '$translate', 'notificationsService', 'authenticationsService', function ($scope, $translate, notificationsService, authenticationsService) {

	var self = this;
	self.overview = {};
	self.environmentId = {};
	self.formData = {type: 'base'};

	/**
	 * List of all authentications defined for given environment
	 *
	 * @param environmentId
	 */
	self.init = function (environmentId) {
		self.environmentId = environmentId;

		$scope.setEnvironment (environmentId);

		authenticationsService.overview (environmentId).then (function (response) {
			self.overview = response.data;
		});
	};

	/**
	 * Delete given authentication
	 *
	 * @param authenticationId
	 */
	self.delete = function (authenticationId) {
		authenticationsService.delete (self.environmentId, authenticationId).then (function (response) {
			self.init (self.environmentId);
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

	/**
	 * Create new authentication in given environment
	 */
	self.create = function () {
		authenticationsService.create (self.formData.environmentsId, self.formData).then (function (response) {
			self.init (self.formData.environmentsId);

			self.manageAuth = false;
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

	/**
	 * Save changes in given authentication info
	 */
	self.edit = function () {
		authenticationsService.edit (self.formData.environmentsId, self.formData.id, self.formData).then (function (response) {
			self.init (self.formData.environmentsId);

			self.manageAuth = false;
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