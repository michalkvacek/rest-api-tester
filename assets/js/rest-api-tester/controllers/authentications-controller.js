var app = angular.module ('restApiTester');

app.controller ('AuthenticationsController', ['$scope', 'authenticationsService', function ($scope, authenticationsService) {

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
			if (response.status == 200) {
				self.overview = response.data;
			}
		});
	};

	/**
	 * Delete given authentication
	 *
	 * @param authenticationId
	 */
	self.delete = function (authenticationId) {
		authenticationsService.delete (self.environmentId, authenticationId).then (function (response) {

			switch (response.status) {
				case 200:
					self.init (self.environmentId);
					break;
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
			self.init (self.formData.environmentId);

			self.manageAuth = false;
		});
	};

	/**
	 * Save changes in given authentication info
	 */
	self.edit = function () {
		authenticationsService.edit (self.formData.environmentsId, self.formData.id, self.formData).then (function (response) {
			switch (response.status) {
				case 201:
					self.init (self.formData.environmentsId);

					self.manageAuth = false;
					break;
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