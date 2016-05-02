/**
 * EnvironmentsController
 *
 * @description :: Server-side logic for managing Environments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	 * List of all environments in given project
	 *
	 * @param res
	 * @param req
	 */
	index: function (req, res) {
		// get all environments assigned to this project

		var findCriterium = {
			where: {projectsId: req.projectId},
			include: []
		};

		// include team members in each environment?
		if (req.param ('withMembers', false)) {
			findCriterium.include.push ({
				model: users,
				as: 'teamMembers',
				where: {id: req.token.id}
			})
		}

		if (req.param ('withTests', false)) {
			findCriterium.include.push ({
				model: tests,
				as: 'tests'
			});
		}

		environments.findAll (findCriterium).then (function (environments) {
			return res.json (environments);
		}).catch (function (err) {
			console.error (err);
		});

	},

	/**
	 * Create new environment in specified project
	 *
	 * @param req
	 * @param res
	 * @returns {*}
	 */
	create: function (req, res) {

		// new environment
		var parameters = {
			usersId: req.token.id,
			projectsId: req.projectId,
			name: req.param ('name'),
			apiEndpoint: req.param ('apiEndpoint'),
			description: req.param ('description')
		};

		// create new environment with data defined above
		environments.create (parameters).then (function (environment) {

			// redirect or send json response with information about successfull creating environment
			return res.created (environment);
		}).catch (function (error) {
			return res.serverError (error);
		})
	},
	/**
	 * Schedule all tests in environment for running now
	 *
	 * @param req
	 * @param res
	 */
	runTests: function (req, res) {
		tests.findAll ({
			where: {environmentsId: req.environmentId},
			include: [{
				model: requests,
				as: 'requests'
			}]
		}).then (function (envTests) {

			for (i in envTests) {
				if (envTests[i].requests.length == 0)
					continue;

				runnedTests.create ({
					testName: envTests[i].name,
					testDescription: envTests[i].description,
					testsId: envTests[i].id,
					status: 'waiting_for_response'
				});
			}

			// lets hope everything will run fine
			return res.ok ();
		});
	}
};

