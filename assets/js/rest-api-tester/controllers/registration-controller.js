// var app = angular.module ('restApiTester');

window.app.controller ('RegistrationController', ['$scope', '$state', 'registrationService', '$location', 'notificationsService', '$translate',
	function ($scope, $state, registration, $location, notificationsService, $translate) {

		var self = this;

		self.formData = {};

		self.localRegistration = function () {
			registration.newLocalUser (self.formData).then (function (response) {
				$translate ('Registrace úspěšná. Heslo bylo odesláno na uvedenou e-mailovou adresu.').then (function (translation) {
					notificationsService.push ('success', translation);

					$state.go ('login');
				});
			}, function (response) {
				switch (response.status) {
					case 400:
						$translate ('Registrace se nezdařila, neboť zadaný e-mail je již registrován.').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
						break;
					default:
						$translate ('Registrace se nezdařila.').then (function (translation) {
							notificationsService.push ('alert', translation);
						});
						break;
				}
			});
		};

		return self;
	}]);