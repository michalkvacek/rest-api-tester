describe ('Testing projects', function () {

	// beforeEach (function () {
	// 	browser.get ('/#/login');
	// 	element (by.model ('login.formData.email')).sendKeys (browser.params.user);
	// 	element (by.model ('login.formData.password')).sendKeys (browser.params.password);
	//
	// 	element (by.id ('login-btn')).click ();
	// });

	it ('should open modal window', function () {

		// login
		browser.get ('/#/login');
		element (by.model ('login.formData.email')).sendKeys (browser.params.user);
		element (by.model ('login.formData.password')).sendKeys (browser.params.password);
		element (by.id ('login-btn')).click ();
		browser.waitForAngular();

		// open window for new project
		element (by.id ('new-project-btn')).click ();
		expect ($('#new-project').isDisplayed ()).toBeTruthy ();

		var date = new Date;

		element(by.model('projects.formData.name')).sendKeys('Testing project '+date.getDay()+"."+date.getMonth()+".");
		element(by.model('projects.formData.description')).sendKeys('Testing project created at '+date);
		element(by.id('create-project')).click();

		// wait for calling $digest
		browser.waitForAngular();

		// check current state
		var currentStateName = browser.executeAsyncScript(function(callback) {
			var el = document.querySelector("html");
			var injector = angular.element(el).injector();
			var service = injector.get('$state');

			callback(service.current.name);
		});

		expect(currentStateName).toMatch("dashboard");
	});

	it ('should check for non-empty project list', function () {
		var projects = element.all(by.repeater('project in projects.overview'));
		
		projects.count().then(function (cnt) {
			expect(cnt > 0).toBeTruthy();
		});
	});
});

