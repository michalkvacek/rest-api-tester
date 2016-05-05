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

					console.log (response.status);

					if (response.status != 'success' && response.status != 'failed') {
						stillRunning = true;
						console.log (response.id + " stale bezi");
						break;
					}

					if (response.status == 'failed') {
						passed = false;
						console.log ('test neprosel!');
						break;
					}
				}

				console.log (stillRunning);
				console.log (passed);

				if (!stillRunning)
					test.update ({status: passed ? 'success' : 'failed'}).then (function () {
					});
			}

		});
	}
};