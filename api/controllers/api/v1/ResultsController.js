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

		var age = req.param ('age', false),
			findCriterium = {
				where: [],
				order: [
					['updatedAt', 'DESC']
				]
			};

		if (age) {
			var date = new Date ();
			findCriterium.where.push ({updatedAt: {$gt: new Date (date.getTime () - age * 3600 * 1000)}});
		}

		var environmentsWhere = [];

		if (req.param ('projectId', false)) {
			environmentsWhere.push ({projectsId: req.param ('projectId')});
		}

		findCriterium.include = [{
			model: tests,
			include: [{model: environments, where: environmentsWhere}]
		}];

		runnedTests.findAll (findCriterium).then (function (results) {
			return res.ok (results);
		})
	}
};

