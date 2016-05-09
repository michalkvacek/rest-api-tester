// var app = angular.module ('restApiTester');

window.app.controller ('RequestsController', [
	'$scope', '$rootScope', 'requestsService', 'headersService', 'httpParametersService', '$state', '$stateParams', "$translate", 'notificationsService',
	function ($scope, $rootScope, requestsService, headersService, httpParametersService, $state, $stateParams, $translate, notificationsService) {

		var self = this;

		$scope.requestId = null;
		self.lastResponse = {};
		self.current = {};
		self.formData = {};
		self.detail = {};
		self.httpParametersData = {};
		self.headersData = {};
		self.headers = {};
		self.httpParameters = {};
		self.originalRequest = {};

		// set some default values
		self.formData.httpMethod = 'GET';

		// prevent multiple loading (and reinitializing) the same models
		self.initiliazed = {detail: []};

		/**
		 * Load request detail
		 *
		 * @param id
		 * @param testId
		 * @param updateBreadcrumbs
		 */
		self.initDetail = function (id, testId, updateBreadcrumbs) {
			if (typeof id == 'undefined')
				id = $stateParams.requestId;

			if (typeof updateBreadcrumbs == 'undefined')
				updateBreadcrumbs = true;

			if (self.initiliazed.detail.indexOf (id) >= 0)
				return;

			requestsService.detail (id, testId).then (function (response) {
				var request = response.data;

				self.detail[id] = request;
				self.current = self.detail[id];
				self.initiliazed.detail.push (id);

				if (updateBreadcrumbs)
					$translate ('Požadavek').then (function (translatedRequest) {
						$rootScope.breadcrumbs = [{
							label: translatedRequest + ': ' + request.name,
							href: $state.href ('request', {requestId: request.id})
						}];
					});

				$rootScope.setEnvironment (request.environmentsId);

			}, function (response) {
				switch (response.status) {
					case 404:
						$translate ('Požadovaný request neexistuje.').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});

						break;
					case 403:
						$translate ('Pro zobrazení tohoho požadavku nemáte dostatečné oprávnění.').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;
					default:
						$translate ($translate ('Nelze načíst požadovaný request. Status odpovědi ze serveru: :statusCode', {statusCode: response.status})).then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;
				}
			});
		};

		/**
		 * Init request detail for edit form
		 */
		self.initDetailForEdit = function () {
			var id = $stateParams.requestId;

			if (angular.equals (self.formData, self.originalRequest))
				return;

			requestsService.detail (id).then (function (response) {
					var request = response.data;

					self.environment = response.data.environment;
					delete response.data.environment;

					// create breadcrumbs links
					$rootScope.breadcrumbs = [
						{
							label: $translate.instant ('Požadavek') + ': ' + request.name,
							href: $state.href ('request', {requestId: request.id})
						},
						{
							label: $translate.instant ('Editor'),
							href: $state.href ('request_editor', {requestId: request.id})
						}
					];

					$rootScope.setEnvironment (request.environmentsId);

					self.detail = request;
					self.formData = angular.copy (response.data);
					self.formData.sendInEnvelope = self.formData.envelope != null;
					self.formData.versionsId = "" + self.formData.versionsId;
					self.formData.authenticationsId = "" + self.formData.authenticationsId;

					self.originalRequest = angular.copy (self.formData);

				}, function (response) {
					switch (response.status) {
						case 404:
							$translate ('Požadovaný request neexistuje.').then (function (translation) {
								notificationsService.push ('alert', translation);
								$state.go ('projects');
							});

							break;
						default:
							$translate.instant ('Nelze načíst požadovaný request. Status odpovědi ze serveru: :statusCode', {statusCode: response.status}).then (function (translation) {
								notificationsService.push ('alert', translation);
								$state.go ('projects');
							});
							break;
					}
				}
			);
		};

		/**
		 * Load last response for given request
		 *
		 * @param requestId
		 */
		self.initLastResponse = function (requestId) {
			if (typeof requestId == 'undefined')
				requestId = $stateParams.requestId;

			requestsService.lastResponse (requestId).then (function (response) {
				self.lastResponse = response.data;
			}, function (response) {
				switch (response.status) {

					case 404:
						$translate ('Požadovaný request neexistuje.').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;
					default:
						$translate ('Nelze načíst požadovaný request. Status odpovědi ze serveru: :statusCode', {statusCode: response.status}).then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});

						break;
				}
			})
		};

		/**
		 * Load list of all tests in environment
		 * @param environmentId
		 * @param options
		 */
		self.initEnvironmentOverview = function (environmentId, options) {
			if (typeof options == 'undefined')
				options = {};

			requestsService.overview (environmentId, options).then (function (response) {
				self.environmentRequests = response.data;
			}, function (response) {
				switch (response.status) {

					case 404:
						$translate ('Požadované prostředí neexistuje. Vyberte prosím jiné.').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
						break;
					default:
						$translate ('Nelze načíst požadovaný request. Status odpovědi ze serveru: :statusCode', {statusCode: response.status}).then (function (translation) {
							notificationsService.push ('alert', translation);
						});
						break;
				}
			});
		};

		self.setRequestId = function (id) {
			$scope.requestId = id;
		};

		/**
		 * Create new request in current environment and assign into test (if test id specified either in route or in formData object)
		 */
		self.create = function () {
			var environmentId = self.formData.environmentsId || $scope.environmentId;
			var testId = self.formData.testsId || $scope.testId;

			self.formData.environmentsId = environmentId;
			self.formData.testsId = testId;

			self.formData = {};

			// try to create new request
			requestsService.create (environmentId, self.formData).then (function (response) {
				$translate ('Úspěšně vytvořeno').then (function (translation) {
					notificationsService.push ('success', translation);
				});
				self.addRequestModal = false;
			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
			});
		};

		/**
		 * Save updated data
		 */
		self.edit = function () {
			var id = $stateParams.requestId;

			// ignore not-changed form
			if (angular.equals (self.formData, self.detail))
				return;

			if (!self.formData.sendInEnvelope)
				self.formData.envelope = null;

			requestsService.edit (id, self.formData).then (function (response) {
				self.initDetailForEdit ();

				$translate ('Úspěšně uloženo.').then (function (translation) {
					notificationsService.push ('success', translation);
				});
			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
			});
		};

		/**
		 * Delete request
		 *
		 * @param environmentId
		 * @param requestId
		 */
		self.delete = function (environmentId, requestId) {
			if (typeof requestId == 'undefined')
				requestId = $stateParams.requestId;

			if (confirm ($translate.instant ('Opravdu?')))
				requestsService.delete (requestId).then (function (response) {
					notificationsService.push ('success', $translate.instant ('Požadavek úspěšně smazán'));

					$state.go ('tests', {environmentId: environmentId});

				}, function (response) {
					$translate ('Nelze vykonat požadavek').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
				});
		};

		//-----------------------------------

		/**
		 * Edit existing HTTP parameter
		 */
		self.httpParameters.edit = function () {
			var requestId = $stateParams.requestId;

			httpParametersService.edit (self.httpParametersData.requestsId, self.httpParametersData.id, self.httpParametersData).then (function (response) {
				self.initDetailForEdit ();
				self.manageHttpParameters = false;

				$translate ('Úspěšně uloženo').then (function (translation) {
					notificationsService.push ('success', translation);
				});
			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
			});
		};

		/**
		 * Delete HTTP parameter from request
		 * @param id
		 */
		self.httpParameters.delete = function (id) {
			var requestId = $stateParams.requestId;

			if (confirm ($translate.instant ('Opravdu?'))) {
				httpParametersService.delete (requestId, id).then (function (response) {
					// update test detail
					self.initDetailForEdit ();
				}, function (response) {
					$translate ('Nelze vykonat požadavek').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
				});
			}
		};

		/**
		 * Add new HTTP parameter
		 */
		self.httpParameters.create = function () {
			var requestId = $stateParams.requestId;

			httpParametersService.create (requestId, self.httpParametersData).then (function (response) {
				self.initDetailForEdit ();
				self.manageHttpParameters = false;

				$translate ('Úspěšně vytvořeno').then (function (translation) {
					notificationsService.push ('success', translation);
				});
			}, function (response) {
				$translate ('Nelze vykonat požadavek').then (function (translation) {
					notificationsService.push ('alert', translation);
				});
			});
		};

		return self;
	}]);