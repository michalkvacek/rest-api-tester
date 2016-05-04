module.exports.cron = {
	runScheduledTests: {
		schedule: '0 * * * * *',
		onTick: function () {
			// scheduledTests.run();
		}
	},
	markDoneTests: {
		schedule: '*/10 * * * * *',
		onTick: function () {
			runnedTestsService.markLastRunStatus();
		}
	}
};