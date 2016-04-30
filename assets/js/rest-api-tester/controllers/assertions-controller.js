var app = angular.module ('restApiTester');

app.controller ('AssertionsController', ['$scope', '$stateParams', 'assertionsService', function ($scope, $stateParams, assertionsService) {
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
		assertionsService.getAssertions (requestId).then (function (response) {
			self.assertions[requestId] = response.data;
		})
	};

	self.newAssertionWindow = function (requestId) {
		self.requestId = requestId;
		self.initTypes ();

		$ ('#new-assertion').foundation ('open');
	};

	self.newAssertion = function () {

		assertionsService.create (self.requestId, self.formData).then (function (response) {
			self.initRequestAssertions (self.requestId);

			$ ('#new-assertion').foundation ('close');
		})
	};

	self.editAssertionWindow = function (id) {
		self.assertionId = id;
		self.initTypes ();

		assertionsService.getDetail (id).then (function (response) {
			self.formData = response.data;

			$ ('#edit-assertion').foundation ('open');
		});

	};

	self.editAssertion = function () {

		assertionsService.edit (self.assertionId, self.formData).then (function (response) {

			// update assertions list
			self.initRequestAssertions (response.data.requestsId);

			$ ('#edit-assertion').foundation ('close');
		});

	};

	self.deleteAssertion = function (id, requestId) {
		var confirmation = confirm ('Opravdu?');

		if (confirmation) {
			assertionsService.delete (id).then (function (response) {
				// update assertions list
				self.initRequestAssertions (requestId);
			});
		}
	};

	return self;
}]);