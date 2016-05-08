var app = angular.module ('restApiTester');

app.controller ('AssertionsController', ['$scope', '$stateParams', '$translate', 'assertionsService', 'notificationsService',
	function ($scope, $stateParams, $translate, assertionsService, notificationsService) {
		var self = this;

		self.formData = {};
		self.assertionId = null;
		self.assertions = {};
		self.types = {};

		// setup some default data
		self.formData.assertionType = 'status_code';

		/**
		 * Load list of all assertion types
		 */
		self.initTypes = function () {
			assertionsService.getTypes ().then (function (response) {
				self.types = response.data;
			});
		};

		/**
		 * Load assertions used in given request
		 *
		 * @param requestId
		 */
		self.initRequestAssertions = function (requestId) {
			if (typeof requestId == 'undefined')
				requestId = $stateParams.requestId;

			assertionsService.getAssertions (requestId).then (function (response) {
				if (response.status != 200) {
					return;
				}

				self.assertions[requestId] = response.data;
			})
		};

		/**
		 * Create new assertion
		 */
		self.create = function () {
			assertionsService.create (self.formData.requestsId, self.formData).then (function (response) {
				switch (response.status) {
					case 201:
						self.initRequestAssertions (self.formData.requestsId);

						self.openModal = false;
						break;
					case 403:
						$translate ('Pro přiřazení validátoru nemáte dostatečná oprávnění.').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
						break;
					default:
						$translate ('Nelze vykonat požadavek').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
						break;
				}
			})
		};

		/**
		 * Edit assertion
		 */
		self.edit = function () {

			console.log(self.formData);

			assertionsService.edit (self.formData.id, self.formData).then (function (response) {
					switch (response.status) {
						case 200:
							// update assertions list
							self.initRequestAssertions (self.formData.requestsId);

							self.openModal = false;
							break;
						case 403:
							$translate ('Pro editaci validátoru nemáte dostatečná oprávnění.').then (function (translation) {
								notificationsService.push ('alert', translation);
							});
							break;
						default:
							$translate ('Nelze vykonat požadavek').then (function (translation) {
								notificationsService.push ('alert', translation);
							});
							break;
					}
				}
			);
		};

		/**
		 * Delete assertion
		 *
		 * @param id
		 * @param requestId
		 */
		self.delete = function (id, requestId) {
			if (confirm ($translate.instant ('Opravdu?'))) {
				assertionsService.delete (id).then (function (response) {
					switch (response.status) {
						case 200:
							// update assertions list
							self.initRequestAssertions (requestId);
							break;
						case 403:
							$translate ('Pro odstranění validátoru nemáte dostatečná oprávnění.').then (function (translation) {
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
			}
		};

		return self;
	}]);