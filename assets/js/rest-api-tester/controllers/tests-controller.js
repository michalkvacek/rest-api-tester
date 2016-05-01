var app = angular.module ('restApiTester');

app.controller ('TestsController', ['$scope', '$stateParams', 'testsService', 'headersService', function ($scope, $stateParams, testsService, headersService) {

	var self = this;

	self.formData = self.detail = self.tests = self.statistics = {};
	self.formData.headers = {};
	self.statisticsButton = 7;

	self.headers = {};


	$scope.$on ('addedRequestIntoTest', function (event, request) {
		if (request.hasOwnProperty ('assignedToTest') && request.assignedToTest.testsId == $scope.testId)
			self.initDetail ();

	});

	self.initStatistics = function (ageInDays) {
		var environmentId = $stateParams.environmentId || $scope.environmentId;
		var testId = $stateParams.testId || $scope.testId;

		testsService.getStatistics (ageInDays, {
			environmentId: environmentId,
			testId: testId
		}).then (function (statistics) {
			self.statistics = statistics.data;
		});
	};

	self.initTestOverview = function () {
		var environmentId = $stateParams.environmentId;

		testsService.getOverview (environmentId).then (function (tests) {
			self.tests = tests.data;
		});
	};

	self.initDetail = function () {
		var testId = $stateParams.testId;

		testsService.getDetail (testId).then (function (test) {
			$scope.testId = testId;
			$scope.environmentId = test.data.environmentsId;

			self.detail = test.data;
		});
	};

	self.newTest = function () {
		var environmentId = $stateParams.environmentId;

		testsService.create (environmentId, self.formData).then (function (response) {
			self.initTestOverview ();
		});
	};

	self.headers.openEditWindow = function (headerId) {
		self.headerId = headerId;

		headersService.detail (headerId).then (function (response) {
			self.formData.headers = response.data;

			$ ('#edit-header').foundation ('open');
		});
	};

	self.headers.edit = function () {
		headersService.edit (self.headerId, self.formData.headers).then (function (response) {
			self.initDetail();

			$ ('#edit-header').foundation ('close');
		});
	};

	self.headers.newHeaderWindow = function (testId) {
		self.formData.headers.testsId = testId;

		$ ('#new-header').foundation ('open');
	};

	self.headers.delete = function (id) {
		var confirmation = confirm ('Opravdu?');

		if (confirmation) {
			headersService.delete (id).then (function (response) {
				// update test detail
				self.initDetail ();
			});
		}
	};

	self.headers.create = function () {
		headersService.create (self.formData.headers).then (function (response) {
			self.initDetail ();
			$ ('#new-header').foundation ('close');
		})
	};

	self.headers.create = function () {
		headersService.create (self.formData.headers).then (function (response) {
			self.initDetail ();
			$ ('#new-header').foundation ('close');
		})
	};

	self.openEditWindow = function () {

		self.formData.name = self.detail.name;
		self.formData.description = self.detail.description;

		$ ('#edit-test').foundation ('open');
	};

	self.edit = function (testId) {
		testsService.edit (testId, self.formData).then (function (response) {
			self.initDetail ();

			$ ('#edit-test').foundation ('close');
		})
	};

	self.assign = function () {
		var testId = $stateParams.testId;

		// todo

		testsService.assignRequest ().then (function (response) {

		});
	};

	return self;
}]);