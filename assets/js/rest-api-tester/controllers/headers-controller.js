// var app = angular.module ('restApiTester');

window.app.controller ('HeadersController', ['$scope', '$translate', '$state', '$stateParams', 'notificationsService', 'headersService',
	function ($scope, $translate, $state, $stateParams, notificationsService, headersService) {

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
				self.initOverview ();

				self.manageHeaders = false;
			}, function (response) {
				switch (response.status) {
					case 403:
						$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;

					default:
						$translate ('Nelze vykonat požadavek').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;
				}
			})
		};

		/**
		 * Edit existing header
		 */
		self.edit = function () {
			headersService.edit (self.formData.id, self.formData).then (function (response) {
				self.initOverview ();

				self.manageHeaders = false;

				$translate ('Úspěšně uloženo').then (function (translation) {
					notificationsService.push ('success', translation);
				});
			}, function (response) {
				switch (response.status) {
					case 403:
						$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;

					default:
						$translate ('Nelze vykonat požadavek').then (function (translation) {
							notificationsService.push ('alert', translation);
							$state.go ('projects');
						});
						break;
				}
			});
		};

		/**
		 * Delete given header
		 * @param id
		 */
		self.delete = function (id) {
			if (confirm ($translate.instant ('Opravdu?'))) {
				headersService.delete (id).then (function (response) {
					self.initOverview ();
				}, function (response) {
					switch (response.status) {
						case 403:
							$translate ('Pro tuto akci nemáte dostatečná oprávnění').then (function (translation) {
								notificationsService.push ('alert', translation);
								$state.go ('projects');
							});
							break;

						default:
							$translate ('Nelze vykonat požadavek').then (function (translation) {
								notificationsService.push ('alert', translation);
								$state.go ('projects');
							});
							break;
					}
				});
			}
		};

		return self;
	}]);