var app = angular.module ('restApiTester');

app.controller ('TestsResultsController', ['$scope', '$stateParams', 'testsResultsService', function ($scope, $stateParams, testsResultsService) {

	var self = this;

	self.test = {};
	self.statistics = {};

	self.init = function () {
		var resultId = $stateParams.testResultId;

		testsResultsService.getDetail (resultId).then (function (response) {
			self.test = response.data;
		});
	};

	self.initStatistics = function () {
		var resultId = $stateParams.testResultId;

		testsResultsService.getStatistics (resultId).then (function (response) {
			self.statistics = response.data;
		})
	};

	return self;
}]);