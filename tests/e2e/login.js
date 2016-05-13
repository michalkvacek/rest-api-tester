describe('Testing login', function() {
	it('should redirect to projects', function() {
		browser.get('/#/login');

		element(by.model('login.formData.email')).sendKeys(browser.params.user);
		element(by.model('login.formData.password')).sendKeys(browser.params.password);

		element(by.id('login-btn')).click();

		expect(browser.getLocationAbsUrl()).toMatch("/projects");

	});

	it('should logout user', function() {
		browser.get('/#/projects');

		element(by.id('logout-btn')).click();

		expect(browser.getLocationAbsUrl()).toMatch("/login");
	});
	
	it('should fail', function() {
		browser.get('/#/login');
		element(by.model('login.formData.email')).sendKeys('invalid@user.com');
		element(by.model('login.formData.password')).sendKeys('123456');

		element(by.id('login-btn')).click();


		expect(browser.getLocationAbsUrl()).toMatch("/login");
	});
});

