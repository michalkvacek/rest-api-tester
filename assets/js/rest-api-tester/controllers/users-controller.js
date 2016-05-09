// var app = angular.module ('restApiTester');

window.app.controller ('UsersController', ['$scope', '$rootScope', '$translate', '$state', 'notificationsService', 'usersService',
	function ($scope, $rootScope, $translate, $state, notificationsService, usersService) {
		var self = this;
		self.profile = {};

		self.initProfile = function () {
			usersService.profile ().then (function (response) {
				self.profile = response.data;

				$translate ('Uživatelský profil').then (function (settings) {
					$rootScope.hideProjectInBreadcrumbs = true;
					$rootScope.breadcrumbs = [{
						label: settings,
						href: $state.href ('environment_settings', {environmentId: response.data.id})
					}];
				});
			});
		};

		self.edit = function () {
			usersService.edit (self.profile).then (function (response) {
					$rootScope.identity = response.data;

					$translate ('Údaje úspěšně změněny').then (function (translation) {
						notificationsService.push ('success', translation);
					});

					$.getScript ("/locales/i10l/angular_" + $rootScope.identity.language + ".js");
					$translate.use ($rootScope.identity.language);
				}, function (response) {
					switch (response.status) {
						case 400:
							$translate ("Zadaný e-mail je již registrován.").then (function (translation) {
								notificationsService.push ('alert', translation);
							});
							break;
						default:
							$translate ('Nelze vykonat požadavek').then (function (translation) {
								notificationsService.push ('alert', translation);
							});
							break;
					}
				}
			);
		};

		return self;
	}]);