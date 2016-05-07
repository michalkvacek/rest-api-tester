/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	 * List of all projects of current user
	 *
	 * @param req
	 * @param res
	 */
	index: function (req, res) {
		userProjects.own (req.token.id, function (err, ownProjects) {
			userProjects.managedByUser (req.token.id, function (err, managedProjects) {
				return res.json ({
					ownProjects: ownProjects,
					managedProjects: managedProjects
				});
			});
		});
	},

	/**
	 * All information about specified project
	 * @param req
	 * @param res
	 */
	detail: function (req, res) {
		projects.find ({where: {id: req.projectId}}).then (function (project) {
			return res.ok (project);
		});
	},

	/**
	 * Create new project
	 *
	 * @param req
	 * @param res
	 */
	create: function (req, res) {
		var name = req.param ('name', null);
		var description = req.param ('description', null);

		projects.create ({
			name: name,
			description: description,
			usersId: req.token.id
		}).then (function (project) {
			// ok
			return res.created (project);
		}).catch (function (err) {
			if (err) {
				console.error (err);
				return res.badRequest (err);
			}
		});
	},

	/**
	 * Update information about current project
	 *
	 * @param req
	 * @param res
	 */
	update: function (req, res) {
		projects.find ({where: {id: req.projectId}}).then (function (project) {
			project.update ({
				name: req.param ('name'),
				description: req.param ('description')
			}).then (function (edit) {
				return res.ok (project);
			});
		}, function (error) {
			return res.serverError (error);
		});
	},

	/**
	 * Delete project and all data in in
	 *
	 * @param req
	 * @param res
	 */
	delete: function (req, res) {
		projects.findOne ({where: {id: req.projectId}}).then (function (env) {
			env.destroy ();

			return res.ok ('deleted');
		})
	}
};

