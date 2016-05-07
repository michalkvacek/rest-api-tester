var app = angular.module ('restApiTester');

app.controller ('RequestsController', [
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

		// set some default values
		self.formData.httpMethod = 'GET';

		// prevent multiple loading (and reinitializing) the same models
		self.initiliazed = {
			detail: false,
			environmentOverview: false
		};

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

			if (self.initiliazed.detail == id)
				return;

			requestsService.detail (id, testId).then (function (response) {
				switch (response.status) {
					case 200:
						var request = response.data;

						self.detail[id] = request;
						self.current = self.detail[id];
						self.initiliazed.detail = id;

						if (updateBreadcrumbs)
							$translate ('Požadavek').then (function (translatedRequest) {
								$rootScope.breadcrumbs = [{
									label: translatedRequest + ': ' + request.name,
									href: $state.href ('request', {requestId: request.id})
								}];
							});

						$rootScope.setEnvironment (request.environmentsId);
						break;
					case 404:
						$translate ('Požadovaný request neexistuje.').then (function (translation) {
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

			requestsService.detail (id).then (function (response) {
					switch (response.status) {
						case 200:
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
							break;

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
				switch (response.status) {
					case 200:
						self.lastResponse = response.data;
						break;
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

			if (self.initiliazed.environmentOverview)
				return;

			if (typeof options == 'undefined')
				options = {};

			requestsService.overview (environmentId, options).then (function (response) {
				switch (response.status) {
					case 200:
						self.environmentRequests = response.data;
						self.initiliazed.environmentOverview = true;
						break;
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

			// try to create new request
			requestsService.create (environmentId, self.formData).then (function (response) {
				if (response.status == 201) {
					$translate ('Úspěšně vytvořeno').then (function (translation) {
						notificationsService.push ('success', translation);
					});
					self.addRequestModal = false;
				} else {
					$translate ('Nelze vykonat požadavek').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
				}
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

			requestsService.edit (id, self.formData).then (function (response) {
				if (response.status != 200) {
					$translate ('Nelze vykonat požadavek').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
				}

				self.initDetailForEdit();

				$translate ('Úspěšně uloženo.').then (function (translation) {
					notificationsService.push ('success', translation);
				});
			})
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
					if (response.status == 200) {
						notificationsService.push ('success', $translate.instant ('Požadavek úspěšně smazán'));

						$state.go ('tests', {environmentId: environmentId});
					} else {
						$translate ('Nelze vykonat požadavek').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
					}
				});
		};

		//-----------------------------------

		/**
		 * Edit existing HTTP parameter
		 */
		self.httpParameters.edit = function () {
			var requestId = $stateParams.requestId;

			httpParametersService.edit (self.httpParametersData.requestsId, self.httpParametersData.id, self.httpParametersData).then (function (response) {
				if (response.status != 200)
					$translate ('Nelze vykonat požadavek').then (function (translation) {
						notificationsService.push ('alert', translation);
					});

				self.initDetailForEdit ();

				self.manageHttpParameters = false;

				$translate ('Úspěšně uloženo').then (function (translation) {
					notificationsService.push ('success', translation);
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
				});
			}
		};

		/**
		 * Add new HTTP parameter
		 */
		self.httpParameters.create = function () {
			var requestId = $stateParams.requestId;

			httpParametersService.create (requestId, self.httpParametersData).then (function (response) {

				if (response.status == 201) {

					self.initDetailForEdit ();

					self.manageHttpParameters = false;

					$translate ('Úspěšně vytvořeno').then (function (translation) {
						notificationsService.push ('success', translation);
					});
				} else {
					$translate ('Nelze vykonat požadavek').then (function (translation) {
						notificationsService.push ('alert', translation);
					});
				}
			})
		};

		return self;
	}]);