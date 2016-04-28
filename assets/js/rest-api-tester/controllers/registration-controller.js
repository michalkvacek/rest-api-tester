var app = angular.module ('restApiTester');

app.controller ('RegistrationController', ['$scope', 'registrationService', '$location', function ($scope, registration, $location) {

	var self = this;

	self.formData = {};

	self.localRegistration = function () {
		registration.newLocalUser (self.formData).then (function (response) {

			console.log(response);

			$location.path ('/login');
		});
	};

	return self;
}])
;