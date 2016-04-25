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
		environments.find ({
			where: {projectsId: req.projectId},
			include: [{
				model: users,
				as: 'teamMembers',
				where: {usersId: req.token.id}
			}]
		}).then (function (environments) {
			return res.json(environments);
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
		var projectId = req.param ('projectId', false);

		if (!projectId)
			return ResponseHandler.action (req, res, false, 'Neexistuje projekt', {redirectTo: '/projects'});

		// new environment
		var parameters = {
			usersId: req.user.id,
			projectsId: projectId
		};
		parameters.merge (req.allParams ());

		// create new environment with data defined above
		environments.create (parameters).then (function (environment) {

			// redirect or send json response with information about successfull creating environment
			return ResponseHandler.action (req, res, true, 'Vytvoreno', {environment: environment});
		}).catch (function (error) {

			// something went wrong...
			console.error (error);
			return ResponseHandler.action (req, res, false, 'Chyba', {
				err: err,
				requestData: req.allParams ()
			});
		})

	}
};

