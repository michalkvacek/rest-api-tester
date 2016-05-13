describe ('Testing project settings', function () {
	it ('should change project name', function () {
		// login
		browser.get ('/#/login');
		element (by.model ('login.formData.email')).sendKeys (browser.params.user);
		element (by.model ('login.formData.password')).sendKeys (browser.params.password);
		element (by.id ('login-btn')).click ();
		browser.waitForAngular ();

		browser.get ('/#/project/' + browser.params.testingProject + "/settings");

		browser.waitForAngular ();

		var notifications = element.all (by.repeater ('notification in globalNotifications'));


		var date = new Date ();
		var newName = "Project " + date;
		element (by.model ('project.formData.name')).clear ().sendKeys (newName);


		// count notifications
		notifications.count ().then (function (cnt) {
			element (by.id ('basic-info-title')).click (); // fire onblur action
			browser.waitForAngular ();
			element.all (by.repeater ('notification in globalNotifications')).count ().then (function (newCnt) {

				// user should see one notification more
				expect (newCnt > cnt).toBeTruthy ();
			});
		});
	});

	it ('should add new environment', function () {
		element (by.id ('environments-title')).click ();
		element (by.id ('new-environment')).click ();
	
		expect ($ ('#new-environment-modal').isDisplayed ()).toBeTruthy ();
	
		element (by.model ('environments.formData.name')).sendKeys ('Testing environment');
		element (by.model ('environments.formData.apiEndpoint')).sendKeys ('http://api.example.com');
	
		var environments = element.all (by.repeater ('environment in environments.overview'));
	
		// count environments
		environments.count ().then (function (cnt) {
	
			// create new environment
			element (by.id ('create-environment-btn')).click ();
	
			browser.waitForAngular ();
			element.all (by.repeater ('environment in environments.overview')).count ().then (function (newCnt) {
	
				// user should see one environment more
				expect (newCnt > cnt).toBeTruthy ();
			});
		});
	});
	
	it ('should delete created environment', function () {
		var environments = element.all (by.repeater ('environment in environments.overview'));
	
		// count environments
		environments.count ().then (function (cnt) {
	
			// delete last environment environment
			environments.last ().element (by.css ('.button.alert')).click ();
	
			var alertDialog = browser.switchTo ().alert ();
			alertDialog.accept ();
	
			browser.waitForAngular ();
			element.all (by.repeater ('environment in environments.overview')).count ().then (function (newCnt) {
	
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
});
