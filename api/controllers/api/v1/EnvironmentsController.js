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
				as: 'teamMembers'
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
	 * Get detail of selected environment
	 * 
	 * @param req
	 * @param res
	 */
	detail: function (req, res) {
		var findCriterium = {
			where: {id: req.environmentId},
			include: []
		};

		// include team members in each environment?
		if (req.param ('withMembers', false)) {
			findCriterium.include.push ({
				model: users,
				as: 'teamMembers'
			})
		}

		if (req.param ('withTests', false)) {
			findCriterium.include.push ({
				model: tests,
				as: 'tests'
			});
		}

		environments.find (findCriterium).then (function (environments) {
			return res.json (environments);
		}).catch (function (err) {
			return res.serverError (err);
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

	update: function (req, res) {
		environments.find ({where: {id: req.environmentId}}).then (function (environment) {

			environment.update ({
				name: req.param ('name'),
				description: req.param ('description'),
				apiEndpoint: req.param ('apiEndpoint')
			}).then (function (edit) {
				return res.ok (environment);
			}, function (error) {
				return res.notFound (error);
			});
		}, function (error) {
			return res.notFound (error);
		});
	},

	delete: function (req, res) {
		environments.findOne ({where: {id: req.environmentId}}).then (function (env) {
			env.destroy ();

			return res.ok ('deleted');
		})
	},

	deleteUser: function (req, res) {
		var userId = req.param ('userId', false);

		if (!userId)
			return res.badRequest ('missing userId');

		if (userId == req.token.id)
			return res.forbidden ('cannot delete self');

		userBelongsToEnvironment.find ({
			where: {
				usersId: userId,
				environmentsId: req.environmentId
			}
		}).then (function (data) {
			data.destroy ();

			return res.ok ('deleted');
		});
	},

	/**
	 * Schedule all tests in environment for running now
	 *
	 * @param req
	 * @param res
	 */
	runTests: function (req, res) {

		testRunner.addToQueue ({environmentsId: req.environmentId}, function (err) {
			console.log (err);
		});

		return res.ok ();
	}
};

