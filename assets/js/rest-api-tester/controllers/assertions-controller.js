var app = angular.module ('restApiTester');

app.controller ('AssertionsController', ['$scope', '$stateParams', 'assertionsService', 'notificationsService', function ($scope, $stateParams, assertionsService, notificationsService) {
	var self = this;

	self.formData = {};
	self.assertionId = null;
	self.assertions = {};
	self.types = {};

	// setup some default data
	self.formData.assertionType = 'status_code';

	self.initTypes = function () {
		assertionsService.getTypes ().then (function (response) {
			self.types = response.data;
		});
	};

	self.initRequestAssertions = function (requestId) {

		if (typeof requestId == 'undefined')
			requestId = $stateParams.requestId;

		assertionsService.getAssertions (requestId).then (function (response) {
			if (response.status != 200) {
				notificationsService.push('alert', 'something went wrong, sorry');
				return;
			}

			self.assertions[requestId] = response.data;
		})
	};

	self.create = function () {
		assertionsService.create (self.formData.requestsId, self.formData).then (function (response) {
			self.initRequestAssertions (self.formData.requestsId);

			self.openModal = false;
		})
	};

	self.edit = function () {
		assertionsService.edit (self.formData.id, self.formData).then (function (response) {

			// update assertions list
			self.initRequestAssertions (response.data.requestsId);

			self.openModal = false;
		});

	};

	self.delete = function (id, requestId) {
		if (confirm ('Opravdu?')) {
			assertionsService.delete (id).then (function (response) {
				// update assertions list
				self.initRequestAssertions (requestId);
			});
		}
	};

	return self;
}]);