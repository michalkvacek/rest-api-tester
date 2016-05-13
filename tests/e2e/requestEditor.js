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

		element (by.id ('edit-request-btn')).click ();
		browser.waitForAngular ();

		// check current state
		var currentStateName = browser.executeAsyncScript (function (callback) {
			var el = document.querySelector ("html");
			var injector = angular.element (el).injector ();
			var service = injector.get ('$state');

			callback (service.current.name);
		});

		expect (currentStateName).toMatch ("request_editor");
	});

	it ('should change HTTP method and edit request', function () {
		var date = new Date;
		var notifications = element.all (by.repeater ('notification in globalNotifications'));

		// count notifications
		notifications.count ().then (function (cnt) {
			element (by.model ('request.formData.description')).clear ().sendKeys ('Last update at ' + date);

			element (by.id ('basic-info-title')).click (); // fire blur action

			browser.waitForAngular ();

			var method = element (by.model ('request.formData.httpMethod'));
			method.$ ('[value="POST"]').click ();

			element (by.id ('basic-info-title')).click (); // fire blur action

			browser.waitForAngular ();

			element.all (by.repeater ('notification in globalNotifications')).count ().then (function (newCnt) {
				browser.waitForAngular ();
				// user should see one notification more
				expect (newCnt > cnt).toBeTruthy ();
			});
		});
	});

	it ('should add new assertion', function () {
		element (by.id ('assertions-title')).click ();

		element (by.id ('new-assertion-btn')).click ();

		expect ($ ('#new-assertion-modal').isDisplayed ()).toBeTruthy ();
		browser.waitForAngular ();

		var type = element (by.model ('asserts.formData.assertionType'));
		type.$ ('[value="response_time"]').click ();

		var comparator = element (by.model ('asserts.formData.comparator'));
		comparator.$ ('[value="lt"]').click ();

		element (by.model ('asserts.formData.expectedValue')).sendKeys ('1000');

		var asserts = element.all (by.repeater ('assertion in asserts.assertions[request.detail.id]'));

		asserts.count ().then (function (cnt) {

			element (by.id ('save-assertion-btn')).click ();

			browser.waitForAngular ();
			element.all (by.repeater ('assertion in asserts.assertions[request.detail.id]')).count ().then (function (newCnt) {

				// user should see one environment more
				expect (newCnt > cnt).toBeTruthy ();
			});
		});
	});

	it ('should remove assertion', function () {
		element (by.id ('assertions-title')).click ();

		var asserts = element.all (by.repeater ('assertion in asserts.assertions[request.detail.id]'));

		// count environments
		asserts.count ().then (function (cnt) {

			// delete last environment environment
			asserts.last ().element (by.css ('.fi-x')).click ();

			var alertDialog = browser.switchTo ().alert ();
			alertDialog.accept ();

			browser.waitForAngular ();
			element.all (by.repeater ('assertion in asserts.assertions[request.detail.id]')).count ().then (function (newCnt) {

				// user should see one environment more
				expect (newCnt < cnt).toBeTruthy ();
			});
		});
	});

	it ('should create http header', function () {

		element (by.id ('headers-title')).click ();
		element (by.id ('new-header-btn')).click ();

		expect ($ ('#headers-modal').isDisplayed ()).toBeTruthy ();

		// count environments
		var environments = element.all (by.repeater ('header in headers.overview'));

		environments.count ().then (function (cnt) {

			// create new header

			element (by.model ('headers.formData.name')).sendKeys ('testing-header');
			element (by.model ('headers.formData.value')).sendKeys (new Date ());
			element (by.id ('header-btn')).click ();

			browser.waitForAngular ();
			element.all (by.repeater ('header in headers.overview')).count ().then (function (newCnt) {

				// user should see one environment more
				expect (newCnt > cnt).toBeTruthy ();
			});
		});
	});

	it ('should delete created http header', function () {
		element (by.id ('headers-title')).click ();

		var headers = element.all (by.repeater ('header in headers.overview'));

		// count environments
		headers.count ().then (function (cnt) {

			// delete last environment environment
			headers.last ().element (by.css ('.fi-x')).click ();

			var alertDialog = browser.switchTo ().alert ();
			alertDialog.accept ();

			browser.waitForAngular ();
			element.all (by.repeater ('header in headers.overview')).count ().then (function (newCnt) {

				// user should see one environment more
				expect (newCnt < cnt).toBeTruthy ();
			});
		});
	});

	it ('should create http parameter', function () {
		element (by.id ('request-parameters-title')).click ();

		element (by.id ('new-parameter-btn')).click ();

		expect ($ ('#http-parameters-modal').isDisplayed ()).toBeTruthy ();

		// count params
		var params = element.all (by.repeater ('param in request.formData.httpParameters'));

		params.count ().then (function (cnt) {

			// create new header

			element (by.model ('request.httpParametersData.name')).sendKeys ('now');
			element (by.model ('request.httpParametersData.value')).sendKeys (new Date ());
			element (by.id ('save-parameter-btn')).click ();

			browser.waitForAngular ();
			element.all (by.repeater ('param in request.formData.httpParameters')).count ().then (function (newCnt) {

				// user should see one environment more
				expect (newCnt > cnt).toBeTruthy ();
			});
		});
	});

	it ('should delete http parameter', function () {
		var params = element.all (by.repeater ('param in request.formData.httpParameters'));

		// count environments
		params.count ().then (function (cnt) {

			// delete last environment environment
			params.last ().element (by.css ('.fi-x')).click ();

			var alertDialog = browser.switchTo ().alert ();
			alertDialog.accept ();

			browser.waitForAngular ();
			element.all (by.repeater ('param in request.formData.httpParameters')).count ().then (function (newCnt) {

				// user should see one environment more
				expect (newCnt < cnt).toBeTruthy ();
			});
		});
	});

});