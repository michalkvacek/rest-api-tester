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

			if (req.param ('withStatistics', false)) {
				var testIds = [];
				for (test in data) {
					testIds.push (data[test].id)
				}

				// todo dodelat statistiky (pocet request + pocet assertions + "zdravi" = vsechny_testy/uspesne_testy)

				console.log (testIds);
			}

			return res.json (data);
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

		var findCriterium = {
			where: {
				createdAt: {
					$gt: new Date (new Date () - age)
				}
			},
			include: []
		};

		if (req.param ('environmentId', false)) {
			findCriterium.where.environmentsId = req.param ('environmentId')
		}

		if (req.param ('testId', false)) {
			findCriterium.where.testsId = req.param ('testId')
		}

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

		tests.find (findCriterium).then (function (test) {
			return res.json (test);
		}, function (error) {
			return res.serverError (error);
		});
	},

	_assignRequests: function (testId, requestIds) {
		// todo
	},

	assignRequests: function (req, res) {
		var requestIds = req.param ('requestIds', {});
		var testId = req.param ('testId');

		if (req.param ('deleteExisting', false)) {
			requestsInTests.destroy ({where: {testsId: testId}}).then (function () {
				return sails.controllers.Tests._assignRequests (testId, requestIds);
			});
		} else {
			return sails.controllers.Tests._assignRequests (testId, requestIds);
		}
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
}
;

