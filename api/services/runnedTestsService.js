module.exports = {
	markLastRunStatus: function () {
		var test = {},
			response = {},
			stillRunning = false,
			passed = true;

		runnedTests.findAll ({
			where: {status: 'evaluating'},
			include: [{model: responses}]
		}).then (function (evaluatedTests) {

			for (i in evaluatedTests) {
				test = evaluatedTests[i];
				stillRunning = false;
				passed = true;

				for (r in test.responses) {
					response = test.responses[r];

					if (response.status != 'success' && response.status != 'failed') {
						stillRunning = true;
						break;
					}

					if (response.status == 'failed') {
						passed = false;
						console.log ('test neprosel!');
						break;
					}
				}

				if (!stillRunning)
					test.update ({status: passed ? 'success' : 'failed'}).then (function () {
					});
			}
		});
	}
};