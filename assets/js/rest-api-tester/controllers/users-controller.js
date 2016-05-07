var app = angular.module ('restApiTester');

app.controller ('UsersController', ['$scope', '$rootScope', '$translate', '$state', 'notificationsService', 'usersService',
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
				if (response.status == 200) {
					$rootScope.identity = response.data;

					$translate ('Údaje úspěšně změněny').then (function (translation) {
						notificationsService.push ('success', translation);
					});

					$.getScript ("/locales/i10l/angular_" + $rootScope.identity.language + ".js");
					$translate.use ($rootScope.identity.language);
				} else {
					$translate ('Nelze vykonat požadavek').then (function (translation) {
						notificationsService.push ('alert', translation);
						$state.go ('projects');
					});
				}

			});
		};

		return self;
	}]);