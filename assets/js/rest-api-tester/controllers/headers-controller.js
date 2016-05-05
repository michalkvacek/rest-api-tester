var app = angular.module ('restApiTester');

app.controller ('HeadersController', ['$scope', '$stateParams', 'headersService', function ($scope, $stateParams, headersService) {

	var self = this;

	self.formData = {};
	self.overview = {};

	var lastFilter = {};

	/**
	 * List of all headers matching given filter
	 * 
	 * @param filter
	 */
	self.initOverview = function (filter) {
		if (typeof filter == 'undefined')
			filter = lastFilter;

		headersService.overview (filter).then (function (response) {
			
			if (response.status != 200) {
				return;
			}
			
			self.overview = response.data;

			// save filter for further usage
			lastFilter = filter;
		});
	};

	/**
	 * Create new header
	 */
	self.create = function () {
		headersService.create (self.formData).then (function (response) {
			if (response.status != 201) {
				return;
			}
			
			self.initOverview ();

			self.manageHeaders = false;
		})
	};

	/**
	 * Edit existing header
	 */
	self.edit = function () {
		headersService.edit (self.formData.id, self.formData).then (function (response) {
			if (response.status != 200) {
				return;
			}
			
			self.initOverview ();

			self.manageHeaders = false;
		});
	};

	/**
	 * Delete given header
	 * @param id
	 */
	self.delete = function (id) {
		var confirmation = confirm ('Opravdu?');

		if (confirmation) {
			headersService.delete (id).then (function (response) {
				if (response.status != 200) {
					return;
				}
				
				self.initOverview ();
			});
		}
	};

	return self;
}]);