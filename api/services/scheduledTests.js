module.exports = {
	run: function () {
		var date = new Date (), test = {}, nextRun = {};
		date.setSeconds (date.getSeconds + 60);

		tests.findAll ({where: {nextRun: {$lt: date}}}).then (function (scheduledTests) {

			for (i in scheduledTests) {
				test = scheduledTests[i];

				testRunner.addToQueue ({id: test.id}, console.error);

				nextRun = test.runInterval ? new Date (Date.now () + test.runInterval * 60 * 1000) : null;

				test.update ({nextRun: nextRun}).then (function (updated) {
					console.log('Scheduled test #'+test.id+' for '+updated.nextRun)
				});
			}
		})
	}
};