/**
 * TestsController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
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
		permissionChecker.canManage (req, res, {
			environmentsId: req.environmentId
		}, function () {
			tests.create (parameters).then (function (test) {
				return res.created (test);
			}, function (error) {
				return res.serverError (error);
			});
		}, function (error) {
			return res.serverError(error);
		});
	}
	,

	update: function (req, res) {
		permissionChecker.canManage (req, res, {
			testsId: req.testId,
			roles: ['manager', 'tester']
		}, function () {
			tests.find ({where: {id: req.testId}}).then (function (test) {

				var nextRun = req.param ('nextRun', false);

				test.update ({
					name: req.param ('name'),
					description: req.param ('description'),
					runInterval: req.param ('runInterval'),
					nextRun: nextRun ? new Date (nextRun) : null
				}).then (function (edited) {
					return res.ok (edited);
				}, function (error) {
					console.log(req.param('runInterval'));
					console.log(req.param('nextRun'));
					return res.serverError(error);
				});

			}, function (error) {
				return res.serverError (error);
			});
		});
	},

	/**
	 * List of all tests in given environment
	 *
	 * Environment is passed as route parameter :environmentId
	 *
	 * @param req
	 * @param res
	 */
	index: function (req, res) {
		permissionChecker.canManage (req, res, {environmentsId: req.environmentId}, function () {
			tests.findAll ({where: {environmentsId: req.environmentId}}).then (function (data) {
				return res.ok (data);
			});
		});
	},

	/**
	 * Get details about given test. Test is specified as route parameter
	 *
	 * Test may be loaded with requests, results and/or headers.
	 *
	 * @param req
	 * @param res
	 */
	detail: function (req, res) {
		var findCriterium = {where: {id: req.testId}, include: []};

		// should requests be also part of response?
		if (req.param ('withRequests', false)) {
			findCriterium.include.push ({
				model: requests,
				as: 'requests'
			});
		}

		// append also test results?
		if (req.param ('withResults', false)) {
			findCriterium.include.push ({
				model: runnedTests,
				required: false,
				// include results only from past 30 days
				where: {updatedAt: {$gt: new Date (Date.now () - 30 * 24 * 3600 * 1000)}}
			})
		}

		permissionChecker.canManage (req, res, {
			testsId: req.testId,
		}, function () {
			tests.find (findCriterium).then (function (test) {

				// does this test even exist?
				if (test == null)
					return res.notFound ();

				// because headers may be assigned to project, environment or test itself, we need to select all these three possibilities
				if (req.param ('withHeaders', false)) {
					headers.findAll ({
						where: {
							$or: [
								{testsId: req.testId, projectsId: null, environmentsId: null},
								{projectsId: req.projectId, environmentsId: null, testsId: null},
								{environmentsId: req.environmentId, projectsId: null, testsId: null}
							]
						}
					}).then (function (allHeaders) {
						test = test.toJSON ();
						test.headers = allHeaders;

						return res.ok (test);
					});
				} else {
					// no headers required, return current result

					return res.ok (test);
				}

			}, function (error) {
				return res.serverError (error);
			});
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
			findCriterium.where = {createdAt: {$gt: new Date (new Date () - age)}};

			// filter stats by environment?
			if (req.param ('environmentId', false)) {
				findCriterium.where.environmentsId = req.param ('environmentId')
			}

			// filter stats by test?
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

			stats.health = stats.testedRequests > 0 ? (stats.passed) / stats.testedRequests * 100 : 0;
			stats.avgResponseSize = stats.testedRequests > 0 ? responseSizeSum / stats.testedRequests : NaN;
			stats.avgResponseTime = stats.testedRequests > 0 ? responseTimeSum / stats.testedRequests : NaN;

			return res.ok (stats);
		}, function (error) {
			return res.serverError (error);
		});
	}
	,

	/**
	 * Assign request to test
	 *
	 * @param req
	 * @param res
	 */
	addRequest: function (req, res) {

		// first, we need to find position for new request (may be used for some kind of sorting in the future)
		permissionChecker.canManage (req, res, {
			testsId: req.testId,
			roles: ['manager', 'tester']
		}, function () {
			requestsInTest.max ('position', {
				where: {testsId: req.testId}
			}).then (function (position) {
				// undefined when adding new request
				if (!position)
					position = 0;

				// assign to test - built-in method was throwing some weird errors
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
		});
	}
	,

	/**
	 * Removes request from test
	 *
	 * @param req
	 * @param res
	 */
	removeRequest: function (req, res) {
		permissionChecker.canManage (req, res, {
			testsId: req.testId,
			roles: ['manager', 'tester']
		}, function () {
			requestsInTest.destroy ({
				where: {
					testsId: req.testId,
					requestsId: req.requestId
				}
			}).then (function () {
				return res.ok ('deleted');
			});
		}, function (error) {
			return res.serverError(error);
		});
	}
	,

	/**
	 * Add test into running queue
	 *
	 * @param req
	 * @param res
	 * @returns {*}
	 */
	run: function (req, res) {
		permissionChecker.canManage (req, res, {
			testsId: req.testId,
			roles: ['manager', 'tester']
		}, function () {
			testRunner.addToQueue ({id: req.testId}, console.error);

			// do not wait until data are stored in database, suppose that everything went fine

			return res.ok ();
		});
	}
	,

	/**
	 * Schedule test for running in the future.
	 *
	 * This method may be replaced with edit()
	 *
	 * @param req
	 * @param res
	 */
	scheduleRun: function (req, res) {
		permissionChecker.canManage (req, res, {
			testsId: req.testId,
			roles: ['manager', 'tester']
		}, function () {
			tests.find ({where: {id: req.testId}}).then (function (test) {

				var nextRun = req.param ('nextRun', null);

				test.update ({
					runInterval: req.param ('runInterval', null),
					nextRun: nextRun ? new Date (nextRun) : null
				}).then (function (edit) {
					return res.ok (edit);
				}, function (err) {
					return res.serverError (err);
				});
			});
		}, function (error) {
			return res.serverError(error);
		});
	}
}
;

