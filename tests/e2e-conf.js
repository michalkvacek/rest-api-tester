exports.config = {
	seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
	baseUrl: 'http://localhost:1337',
	specs: ['e2e/*.js'],
	params: {
		user: 'michal@kvacek.cz',
		password: 'michal',
		testingProject: 21,
		testingEnvironment: 33
	},
	onPrepare: function() {
		browser.driver.manage().window().setSize(1600, 1200);
	},
	capabilities: {
		'browserName': 'firefox',
		'binary': '/usr/bin/firefox'
	}
};