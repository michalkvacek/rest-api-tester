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

	statistics: function (req, res) {
		tests.count ({where: {environmentsId: req.environmentId}}).then (function (testsCount) {
			return res.json ({
				health: "94.45",
				avgResponseTime: 132,
				maxResponseTime: 10022,
				requests: testsCount,
				assertions: 2 * testsCount
			})
		});
	},

	detail: function (req, res) {

		var findCriterium = {where: {id: req.testId}, include: []};

		if (req.param ('withRequests', false)) {
			findCriterium.include.push ({
				model: requests,
				as: 'requests',
				where: {testsId: req.testId}
			});
		}

		tests.find (findCriterium).then (function (test) {
			return res.json (test);
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
			usersId: req.user.id,
			environmentsId: req.environmentId
		};
		parameters.merge (req.allParams ());

		// create new test
		tests.create (parameters).then (function (test) {
			return res.created ({test: test});
		});
	}
};

