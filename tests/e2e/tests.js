describe ('Testing manipulation with tests', function () {
	it ('should create new one', function () {
		// login
		browser.get ('/#/login');
		element (by.model ('login.formData.email')).sendKeys (browser.params.user);
		element (by.model ('login.formData.password')).sendKeys (browser.params.password);
		element (by.id ('login-btn')).click ();
		browser.waitForAngular ();

		browser.get ('/#/environment/' + browser.params.testingEnvironment + '/tests');
		
		element (by.id ('new-test-btn')).click ();
		expect ($ ('#new-test-modal').isDisplayed ()).toBeTruthy ();
		
		element (by.model ('test.formData.name')).sendKeys ('Test from Protractor');
		element (by.id ('create-test-btn')).click ();
		
		browser.waitForAngular ();
		
		// check current state
		var currentStateName = browser.executeAsyncScript (function (callback) {
			var el = document.querySelector ("html");
			var injector = angular.element (el).injector ();
			var service = injector.get ('$state');
		
			callback (service.current.name);
		});
		
		expect (currentStateName).toMatch ("test_detail");
	});

	it ('should add new request', function () {
		element (by.id ('new-request-btn')).click ();
		expect ($ ('#new-request-modal').isDisplayed ()).toBeTruthy ();
	
		element (by.model ('reqController.formData.name')).sendKeys ('Testing request');
		element (by.model ('reqController.formData.httpMethod')).sendKeys ('GET');
		element (by.model ('reqController.formData.url')).sendKeys ('http://example.com/');
	
		element.all (by.repeater ('request in tests.detail.requests')).count ().then (function (cnt) {
	
			// create new request
			element (by.id ('create-request-btn')).click ();
	
			browser.waitForAngular ();
	
			element.all (by.repeater ('request in tests.detail.requests')).count ().then (function (newCnt) {
				expect (newCnt > cnt).toBeTruthy ();
				expect ($ ('#new-request-modal').isDisplayed ()).toBeFalsy ();
			});
		});
	});
	
	it ('should add existing request', function () {
		element (by.id ('new-request-btn')).click ();
		expect ($ ('#new-request-modal').isDisplayed ()).toBeTruthy ();
		element (by.id ('existing-request-title')).click ();

		element.all (by.repeater ('request in tests.detail.requests')).count ().then (function (cnt) {

			// create new request
			element.all (by.id ('existing-request')).all (by.css ('.success')).first ().click ();

			browser.waitForAngular ();

			element.all (by.repeater ('request in tests.detail.requests')).count ().then (function (newCnt) {
				expect (newCnt > cnt).toBeTruthy ();

				element.all (by.id ('new-request-modal')).all (by.css ('.close-button')).click ();
				expect ($ ('#new-request-modal').isDisplayed ()).toBeFalsy ();
			});
		});
	});

	it ('should delete request from test', function () {
		var requests = element.all (by.repeater ('request in tests.detail.requests'));

		requests.count ().then (function (cnt) {

			requests.first ().click ();

			requests.first ().element (by.css ('.fi-x')).click ();
			var alertDialog = browser.switchTo ().alert ();
			alertDialog.accept ();

			browser.waitForAngular ();

			element.all (by.repeater ('request in tests.detail.requests')).count ().then (function (newCnt) {
				expect (newCnt < cnt).toBeTruthy ();
			});
		});
	});

	it ('should edit test', function () {

		var date = new Date ();
		element (by.id ('edit-test-btn')).click ();
		element (by.model ('tests.formData.description')).clear ().sendKeys ('Last update in ' + date);
		var run = element (by.model ('tests.formData.run'));
		run.$ ('[value="periodicaly"]').click ();

		var runInterval = element (by.model ('tests.formData.runInterval'));
		runInterval.$ ('[value="8640"]').click ();
		element (by.id ('save-test-btn')).click ();

		browser.waitForAngular ();
		element (by.css ('.test-description')).getText ().then (function (text) {
			expect (text.length).not.toEqual (0)
		});
	});

	it ('should contain some tests', function () {
		browser.get ('/#/environment/' + browser.params.testingEnvironment + '/tests');
	
		element.all (by.repeater ('test in tests.tests')).count ().then (function (cnt) {
			expect (cnt > 0).toBeTruthy ();
		})
	});
});