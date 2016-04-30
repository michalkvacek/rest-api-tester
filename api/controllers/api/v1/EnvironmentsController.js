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

		if (req.param ('withResults', false)) {

		}

		environments.findAll (findCriterium).then (function (environments) {
			return res.json (environments);
		}).catch (function (err) {
			console.error (err);
		});

	},

	/**
	 * Method for obtaining statistics for given environment
	 *
	 * @param req
	 * @param res
	 */
	statistics: function (req, res) {
		return res.json ({stats: [], notImplemented: 'yet'})
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
			name: req.param('name'),
			apiEndpoint: req.param('apiEndpoint'),
			description: req.param('description')
		};

		// create new environment with data defined above
		environments.create (parameters).then (function (environment) {

			// redirect or send json response with information about successfull creating environment
			return res.created (environment);
		}).catch (function (error) {
			return res.serverError (error);
		})

	}
};

