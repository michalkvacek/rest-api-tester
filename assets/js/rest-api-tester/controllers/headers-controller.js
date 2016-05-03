var app = angular.module ('restApiTester');

app.controller ('HeadersController', ['$scope', '$stateParams', 'headersService', function ($scope, $stateParams, headersService) {

	var self = this;

	self.formData = {};
	self.overview = {};

	var lastFilter = {};

	self.initOverview = function (filter) {

		if (typeof filter == 'undefined')
			filter = lastFilter;

		headersService.overview (filter).then (function (response) {
			self.overview = response.data;

			// save filter for further usage
			lastFilter = filter;
		});
	};

	self.create = function (data) {
		headersService.create (self.formData).then (function (response) {
			self.initOverview ();

			$ ('#new-header').foundation ('close');
		})
	};

	self.edit = function () {
		headersService.edit (self.formData.id, self.formData).then (function (response) {
			self.initOverview ();

			$ ('#edit-header').foundation ('close');
		});
	};
	self.delete = function (id) {
		var confirmation = confirm ('Opravdu?');

		if (confirmation) {
			headersService.delete (id).then (function (response) {
				self.initOverview ();
			});
		}
	};

	self.create = function () {
		headersService.create (self.formData).then (function (response) {
			self.initOverview ();
			$ ('#new-header').foundation ('close');
		})
	};

	return self;
}]);