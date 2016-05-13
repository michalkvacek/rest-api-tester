describe ('Testing request', function () {
	it ('should point to some request', function () {
		// login
		browser.get ('/#/login');
		element (by.model ('login.formData.email')).sendKeys (browser.params.user);
		element (by.model ('login.formData.password')).sendKeys (browser.params.password);
		element (by.id ('login-btn')).click ();
		browser.waitForAngular ();

		browser.get ('/#/environment/' + browser.params.testingEnvironment + "/tests");

		browser.waitForAngular ();

		element.all (by.repeater ('test in tests.tests')).all (by.css ('.fi-magnifying-glass')).first ().click ();

		browser.waitForAngular ();

		var firstRequest = element.all (by.repeater ('request in tests.detail.requests')).first ();
		firstRequest.click ();

		browser.waitForAngular ();

		firstRequest.element (by.css ('.fi-magnifying-glass')).click ();

		browser.waitForAngular ();

		// check current state
		var currentStateName = browser.executeAsyncScript (function (callback) {
			var el = document.querySelector ("html");
			var injector = angular.element (el).injector ();
			var service = injector.get ('$state');

			callback (service.current.name);
		});

		expect (currentStateName).toMatch ("request");
	});

	it ('should add new assertion', function () {
		element (by.id ('new-assertion-btn')).click ();

		expect ($ ('#new-assertion-modal').isDisplayed ()).toBeTruthy ();
		browser.waitForAngular ();

		var type = element (by.model ('asserts.formData.assertionType'));
		type.$ ('[value="response_time"]').click ();

		var comparator = element (by.model ('asserts.formData.comparator'));
		comparator.$ ('[value="lt"]').click ();

		element (by.model ('asserts.formData.expectedValue')).sendKeys ('1000');

		var asserts = element.all (by.repeater ('assertion in asserts.assertions[request.current.id]'));

		asserts.count ().then (function (cnt) {

			element (by.id ('save-assertion-btn')).click ();

			browser.waitForAngular ();
			element.all (by.repeater ('assertion in asserts.assertions[request.current.id]')).count ().then (function (newCnt) {

				// user should see one environment more
				expect (newCnt > cnt).toBeTruthy ();
			});
		});
	});

	it ('should remove assertion', function () {
		var asserts = element.all (by.repeater ('assertion in asserts.assertions[request.current.id]'));

		// count environments
		asserts.count ().then (function (cnt) {

			// delete last environment environment
			asserts.last ().element (by.css ('.fi-x')).click ();

			var alertDialog = browser.switchTo ().alert ();
			alertDialog.accept ();

			browser.waitForAngular ();
			element.all (by.repeater ('assertion in asserts.assertions[request.current.id]')).count ().then (function (newCnt) {

				// user should see one environment more
				expect (newCnt < cnt).toBeTruthy ();
			});
		});
	});
});