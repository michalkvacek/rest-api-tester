module.exports = {
	run: function () {
		var test = {},
			nextRun = {};

		tests.findAll ({where: {nextRun: {$lt: Date.now ()}}}).then (function (scheduledTests) {
			for (i in scheduledTests) {
				test = scheduledTests[i];

				// add test to queue for running
				// we need to run this task for each test, do not move it!
				// this limit is because of selecting headers from environment and project
				testRunner.addToQueue ({id: test.id}, console.error);

				// and setup next time (or set NULL when should run only once)
				nextRun = test.runInterval ? new Date (Date.now () + test.runInterval * 60 * 1000) : null;

				test.update ({nextRun: nextRun}).then (function (updated) {
					console.log ('Scheduled test #' + test.id + ' for ' + updated.nextRun)
				});
			}
		})
	}
};