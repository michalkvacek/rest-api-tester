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
		var envId = req.param ('environmentId', false);

		// test if any environment was given
		if (!envId) return res.redirect ('/projects');

		tests.findAll ({where: {environmentsId: envId}}).then (function (data) {
	
			// pridat tabulku pro statistiky

			return res.json (data);
		});
	},

	testParts: function (req, res) {
		var testId = req.param('testId');



	},

	/**
	 * Create new test in given environment
	 *
	 * @param req
	 * @param res
	 */
	create: function (req, res) {
		var envId = req.param ('environmentId', false);

		// test if any environment was given
		if (!envId) return res.redirect ('/projects');

		var parameters = {
			usersId: req.user.id,
			environmentsId: envId,
		};
		parameters.merge (req.allParams ());

		// create new test
		tests.create (parameters).then (function (test) {
			
		}).catch (function (error) {
		
		});
	}
};

