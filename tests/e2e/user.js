describe('Testing user profile edit', function() {
	it('should change password', function() {
		browser.get('/#/login');

		element(by.model('login.formData.email')).sendKeys(browser.params.user);
		element(by.model('login.formData.password')).sendKeys(browser.params.password);

		element(by.id('login-btn')).click();

		browser.waitForAngular();

		browser.get('/#/user');

		element(by.model('user.profile.password')).sendKeys('changed-password');

		var notifications = element.all (by.repeater ('notification in globalNotifications'));

		// count notifications
		notifications.count ().then (function (cnt) {
			element(by.id('save-profile-btn')).click();

			browser.waitForAngular ();

			element.all (by.repeater ('notification in globalNotifications')).count ().then (function (newCnt) {
				// user should see one notification more
				expect (newCnt > cnt).toBeTruthy ();
			});
		});
	});

	it('should login with new password', function() {
		browser.get('/#/login');

		element(by.model('login.formData.email')).sendKeys(browser.params.user);
		element(by.model('login.formData.password')).sendKeys('changed-password');

		element(by.id('login-btn')).click();

		browser.waitForAngular();

		expect(browser.getLocationAbsUrl()).toMatch("/projects");
	});

	it('should change password back to original', function() {
		browser.get('/#/user');

		element(by.model('user.profile.password')).sendKeys(browser.params.password);

		var notifications = element.all (by.repeater ('notification in globalNotifications'));

		// count notifications
		notifications.count ().then (function (cnt) {
			element(by.id('save-profile-btn')).click();

			browser.waitForAngular ();

			element.all (by.repeater ('notification in globalNotifications')).count ().then (function (newCnt) {
				// user should see one notification more
				expect (newCnt > cnt).toBeTruthy ();
			});
		});

	});
});

