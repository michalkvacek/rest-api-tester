/**
 * TestsController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
	 * List of all tests in given environment
	 *
	 * Environment is passed as route parameter :environmentId
	 *
	 * @param req
	 * @param res
	 */
	index: function (req, res) {
		tests.findAll ({where: {environmentsId: req.environmentId}}).then (function (data) {
			return res.ok (data);
		});
	},

	/**
	 * Method for obtaining statistics for given environment
	 *
	 * @param req
	 * @param res
	 */
	statistics: function (req, res) {

		// statistical data for last <age> days
		var age = req.param ('age', 7),
			stats = {
				avgResponseTime: 0,
				maxResponseTime: 0,
				avgResponseSize: 0,
				maxResponseSize: 0,
				passed: 0,
				failed: 0
			},
			responseSizeSum = 0,
			responseTimeSum = 0;

		// convert to miliseconds
		age *= 24 * 3600 * 1000;

		var findCriterium = {include: []};

		// filter statistics
		if (!req.param ('testResultId', false)) {

			// common statistics

			findCriterium.where = {
				createdAt: {
					$gt: new Date (new Date () - age)
				}
			};
			if (req.param ('environmentId', false)) {
				findCriterium.where.environmentsId = req.param ('environmentId')
			}

			if (req.param ('testId', false)) {
				findCriterium.where.testsId = req.param ('testId')
			}
		} else {
			// statistics for evaluated test
			findCriterium.where = {runnedTestsId: req.param ('testResultId')}
		}

		// find all responses and calculate statistics data
		responses.findAll (findCriterium).then (function (data) {
			stats.testedRequests = data.length;

			for (i in data) {
				if (!data.hasOwnProperty (i)) continue;

				if (data[i].passedAssertions)
					stats.passed++;
				else
					stats.failed++;

				if (data[i].responseTime > stats.maxResponseTime)
					stats.maxResponseTime = data[i].responseTime;

				if (data[i].responseSize > stats.maxResponseSize)
					stats.maxResponseSize = data[i].responseSize;

				responseSizeSum += data[i].responseSize;
				responseTimeSum += data[i].responseTime;
			}

			stats.health = stats.testedRequests > 0 ? (stats.passed + stats.failed) / stats.passed * 100 : 0;
			stats.avgResponseSize = stats.testedRequests > 0 ? responseSizeSum / stats.testedRequests : NaN;
			stats.avgResponseTime = stats.testedRequests > 0 ? responseTimeSum / stats.testedRequests : NaN;

			return res.ok (stats);
		}, function (error) {
			return res.serverError (error);
		});
	},

	detail: function (req, res) {

		var findCriterium = {where: {id: req.testId}, include: []};

		if (req.param ('withRequests', false)) {
			findCriterium.include.push ({
				model: requests,
				as: 'requests'
			});
		}

		if (req.param ('withResults', false)) {
			findCriterium.include.push ({
				model: runnedTests,
			})
		}

		tests.find (findCriterium).then (function (test) {

			test = test.toJSON ();

			if (req.param ('withHeaders', false)) {
				headers.findAll ({
					where: {
						$or: [
							{testsId: req.testId},
							{projectsId: req.projectId},
							{environmentsId: req.environmentId}
						]
					}
				}).then (function (allHeaders) {
					test.headers = allHeaders;

					return res.json (test);
				});
			} else {
				return res.json (test);

			}

		}, function (error) {
			return res.serverError (error);
		});
	}
	,

	addRequest: function (req, res) {
		requestsInTest.max ('position', {
			where: {testsId: req.testId}
		}).then (function (position) {
			if (!position)
				position = 0;

			requestsInTest.create ({
				testsId: req.testId,
				requestsId: req.requestId,
				position: parseInt (position) + 1
			}).then (function (assignedTest) {
				return res.created (assignedTest);
			})
		}, function (error) {
			return res.serverError (error);
		});
	},

	removeRequest: function (req, res) {
		requestsInTest.destroy ({where: {testsId: req.testId, requestsId: req.requestId}}).then (function () {
			return res.ok ('deleted');
		});
	},

	/**
	 * Create new test in given environment
	 *
	 * @param req
	 * @param res
	 */
	create: function (req, res) {
		var parameters = {
			usersId: req.token.id,
			environmentsId: req.environmentId,
			name: req.param ('name'),
			description: req.param ('description')
		};

		// create new test
		tests.create (parameters).then (function (test) {
			return res.created (test);
		}, function (error) {
			return res.serverError (error);
		});
	}
	,

	update: function (req, res) {
		tests.find ({where: {id: req.testId}}).then (function (test) {

			test.update ({
				name: req.param ('name'),
				description: req.param ('description'),
			}).then (function (edited) {
				return res.ok (edited);
			});

		}, function (error) {
			return res.serverError (error);
		})
	},

	run: function (req, res) {
		testRunner.addToQueue({id: req.testId}, function (err) {
			console.log(err);
		});
		
		return res.ok();

	},

	scheduleRun: function (req, res) {
		tests.find ({where: {id: req.testId}}).then (function (test) {

			var nextRun = req.param ('nextRun', null);

			test.update ({
				runInterval: req.param ('runInterval', null),
				nextRun: nextRun ? new Date (nextRun) : null
			}).then (function (edit) {
				return res.ok (edit);
			}, function (err) {
				return res.serverError (err);
			})
		})
	}
}
;

