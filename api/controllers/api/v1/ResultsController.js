/**
 * ResultController
 *
 * @description :: Server-side logic for managing Results
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	detail: function (req, res) {
		var resultId = req.param ('testResultId');

		runnedTests.find ({
			where: {id: resultId},
			include: [{
				model: responses,
				include: [{
					model: evaluatedAssertions
				}]
			}]
		}).then (function (result) {
			if (!result)
				return res.notFound ();

			return res.ok (result);

		}, function (error) {
			return res.serverError (error);
		})
	},

	overview: function (req, res) {

		var managedEnvironmentIds = Object.keys (req.managedEnvironments);

		// no environments found, no results sent
		if (managedEnvironmentIds.length == 0)
			return res.ok ();

		var age = req.param ('age', false),
			findCriterium = {
				attributes: ['id', 'testsId', 'status', 'updatedAt', 'testName'],
				where: [{environmentsId: {$in: managedEnvironmentIds}}],
				order: [
					['updatedAt', 'DESC']
				]
			};

		if (age) {
			var date = new Date ();
			findCriterium.where.push ({updatedAt: {$gt: new Date (date.getTime () - age * 3600 * 1000)}});
		}

		runnedTests.findAll (findCriterium).then (function (results) {
			return res.ok (results);
		})
	}
};

