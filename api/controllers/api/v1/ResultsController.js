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
	}
};

