var app = angular.module ('restApiTester');

app.controller ('RequestsController', [
	'$scope', '$rootScope', 'requestsService', 'headersService', 'httpParametersService', '$state', '$stateParams',
	function ($scope, $rootScope, requestsService, headersService, httpParametersService, $state, $stateParams) {

		var self = this;

		$scope.requestId = null;
		self.lastResponse = self.current = self.formData = self.detail = {};
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

		self.initDetail = function (id, testId) {

			if (typeof id == 'undefined')
				id = $stateParams.requestId;

			if (self.initiliazed.detail == id)
				return;

			requestsService.detail (id, testId).then (function (response) {
				var request = response.data;

				self.detail[id] = request;
				self.current = self.detail[id];
				self.initiliazed.detail = id;

				$rootScope.breadcrumbs = [{
					label: 'Request: ' + request.name,
					href: $state.href ('request', {requestId: request.id})
				}];

				$rootScope.setEnvironment (request.environmentsId);
			});
		};

		self.initDetailForEdit = function () {
			var id = $stateParams.requestId;

			requestsService.detail (id).then (function (response) {
				var request = response.data;

				self.environment = response.data.environment;
				delete response.data.environment;

				// create breadcrumbs links
				$rootScope.breadcrumbs = [
					{
						label: 'Request: ' + request.name,
						href: $state.href ('request', {requestId: request.id})
					},
					{
						label: 'Editor',
						href: $state.href ('request_editor', {requestId: request.id})
					}
				];

				$rootScope.setEnvironment (request.environmentsId);

				self.formData = response.data;
			});
		};

		self.initLastResponse = function (requestId) {
			if (typeof requestId == 'undefined')
				requestId = $stateParams.requestId;

			requestsService.lastResponse (requestId).then (function (response) {
				self.lastResponse = response.data;
			})
		};

		self.initEnvironmentOverview = function (environmentId, options) {

			if (self.initiliazed.environmentOverview)
				return;

			if (typeof options == 'undefined')
				options = {};

			requestsService.overview (environmentId, options).then (function (response) {
				self.environmentRequests = response.data;
				self.initiliazed.environmentOverview = true;
			});
		};

		self.setRequestId = function (id) {
			$scope.requestId = id;
		};

		self.create = function () {

			var environmentId = self.formData.environmentsId || $scope.environmentId;
			var testId = self.formData.testsId || $scope.testId;

			self.formData.environmentsId = environmentId;
			self.formData.testsId = testId;

			requestsService.create (environmentId, self.formData).then (function (response) {
				$ ('#new-request-window').foundation ('close');
			});
		};

		self.edit = function () {
			var id = $stateParams.requestId;

			requestsService.edit (id, self.formData).then (function (response) {
				// $state.go ('request', {requestId: id});
			})
		};

		self.delete = function (environmentId, requestId) {
			if (typeof requestId == 'undefined')
				requestId = $stateParams.requestId;

			requestsService.delete (requestId).then (function (response) {
				$state.go ('tests', {environmentId: environmentId});
			});
		};

		self.headers.openEditWindow = function (headerId) {
			self.headerId = headerId;

			headersService.detail (headerId).then (function (response) {
				self.headersData = response.data;

				$ ('#edit-header').foundation ('open');
			});
		};

		self.headers.edit = function () {
			headersService.edit (self.headerId, self.headersData).then (function (response) {
				self.initDetailForEdit ();

				$ ('#edit-header').foundation ('close');
			});
		};

		self.headers.newHeaderWindow = function () {
			self.headersData.requestsId = $stateParams.requestId;

			$ ('#new-header').foundation ('open');
		};
		self.headers.delete = function (id) {
			var confirmation = confirm ('Opravdu?');

			if (confirmation) {
				headersService.delete (id).then (function (response) {
					// update test detail
					self.initDetailForEdit ();
				});
			}
		};

		self.headers.create = function () {
			headersService.create (self.headersData).then (function (response) {
				self.initDetailForEdit ();
				$ ('#new-header').foundation ('close');
			})
		};

		//-----------------------------------

		self.httpParameters.openEditWindow = function (httpParameterId) {
			self.httpParameterId = httpParameterId;
			var requestId = $stateParams.requestId;

			httpParametersService.detail (requestId, httpParameterId).then (function (response) {
				self.httpParametersData = response.data;

				$ ('#edit-httpParameter').foundation ('open');
			});
		};

		self.httpParameters.edit = function () {
			var requestId = $stateParams.requestId;

			httpParametersService.edit (requestId, self.httpParameterId, self.httpParametersData).then (function (response) {
				self.initDetailForEdit ();

				$ ('#edit-httpParameter').foundation ('close');
			});
		};

		self.httpParameters.newHttpParameterWindow = function () {
			self.httpParametersData.requestsId = $stateParams.requestId;
			var requestId = $stateParams.requestId;

			$ ('#new-httpParameter').foundation ('open');
		};

		self.httpParameters.delete = function (id) {
			var confirmation = confirm ('Opravdu?');
			var requestId = $stateParams.requestId;

			if (confirmation) {
				httpParametersService.delete (requestId, id).then (function (response) {
					// update test detail
					self.initDetailForEdit ();
				});
			}
		};

		self.httpParameters.create = function () {
			var requestId = $stateParams.requestId;

			httpParametersService.create (requestId, self.httpParametersData).then (function (response) {
				self.initDetailForEdit ();
				$ ('#new-httpParameter').foundation ('close');
			})
		};

		return self;
	}]);