describe ('Testing environment settings', function () {
	it ('should change environment name', function () {
		// login
		browser.get ('/#/login');
		element (by.model ('login.formData.email')).sendKeys (browser.params.user);
		element (by.model ('login.formData.password')).sendKeys (browser.params.password);
		element (by.id ('login-btn')).click ();
		browser.waitForAngular ();

		browser.get ('/#/environments/' + browser.params.testingEnvironment + "/settings");

		var date = new Date ();
		var newName = "Environment	" + date.getDay()+" - "+date.getMonth();
		element (by.model ('environment.formData.name')).clear ().sendKeys (newName);

		var notifications = element.all (by.repeater ('notification in globalNotifications'));

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

	it ('should add new user', function () {
		element (by.id ('users-title')).click ();
		element (by.id ('new-user-btn')).click ();

		expect ($ ('#new-user-modal').isDisplayed ()).toBeTruthy ();

		var role = element (by.model ('environment.addUser.role'));
		role.$('[value="host"]').click();

		element (by.model ('environment.addUser.email')).sendKeys ('test@test.cz');

		var users = element.all (by.repeater ('user in environment.detail.teamMembers'));

		// count users
		users.count ().then (function (cnt) {

			// create new environment
			element (by.id ('assign-user-btn')).click ();

			browser.waitForAngular ();
			element.all (by.repeater ('user in environment.detail.teamMembers')).count ().then (function (newCnt) {

				// user should see one environment more
				expect (newCnt > cnt).toBeTruthy ();
			});
		});
	});

	it ('should delete assigned user', function () {
		element (by.id ('users-title')).click ();
		var users = element.all (by.repeater ('user in environment.detail.teamMembers'));

		// count users
		users.count ().then (function (cnt) {

			// delete last environment environment
			users.all(by.css ('.fi-x')).first().click ();

			var alertDialog = browser.switchTo ().alert ();
			alertDialog.accept ();

			browser.waitForAngular ();
			element.all (by.repeater ('user in environment.detail.teamMembers')).count ().then (function (newCnt) {

				// user should see one environment more
				expect (newCnt < cnt).toBeTruthy ();
			});
		});
	});

	


});
