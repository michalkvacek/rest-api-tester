module.exports.cron = {

	/**
	 * Add scheduled test into running queue
	 */
	runScheduledTests: {
		schedule: '0 * * * * *',
		onTick: function () {
			scheduledTests.run();
		}
	},

	/**
	 * Collect all finished requests/responses and mark test as failed or as passed
	 */
	markDoneTests: {
		schedule: '*/25 * * * * *',
		onTick: function () {
			runnedTestsService.markLastRunStatus();
		}
	}
};