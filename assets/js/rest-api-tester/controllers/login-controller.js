// var app = angular.module ('restApiTester');

window.app.controller ('LoginController', ['$scope', '$rootScope', '$state', '$translate', 'notificationsService', 'loginService',
	function ($scope, $rootScope, $state, $translate, notificationsService, loginService) {

		var self = this;

		self.formData = {};
		self.forgottenPassword = {};

		/**
		 * Login user with local credentials
		 *
		 * @param options
		 */
		self.localAuth = function (options) {
			if (typeof options == "undefined")
				options = {};

			loginService.localAuth (self.formData).then (function (response) {
				if (options.redirect)
					$translate ('Přihlášení bylo úspěšné').then (function (translation) {
						$state.go ('projects');

						notificationsService.push ('success', translation);

						$rootScope.refreshProjectOverview ();
					});
			}, function (response) {
				switch (response.status) {
					case 403:
						notificationsService.push ('alert', $translate.instant ('Přihlášení se nezdařilo. Zkontrolujte přihlašovací údaje, prosím.'));
						break;
					default:
						notificationsService.push ('alert', $translate.instant ('Přihlášení selhalo'));
						break;
				}
			});
		};

		self.sendForgottenPassword = function () {
			loginService.forgottenPassword (self.forgottenPassword).then (function (response) {
				$translate ('Nové heslo úspěšně odesláno na uvedený e-mail').then (function (translation) {
					notificationsService.push ('success', translation);

					self.formData.email = self.forgottenPassword.email;

					self.forgottePasswordModal = false;
				});
			}, function (response) {
				$translate ('Nelze odeslat heslo. Zadáváte správný e-mail?').then (function (translation) {
					notificationsService.push ('alert', translation);

					self.forgottePasswordModal = false;
				});
			});
		};

		return self;
	}]);