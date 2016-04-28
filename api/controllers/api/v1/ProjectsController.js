/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	test: function (req, res) {
		return res.send ('proslo to');
	},

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

	create: function (req, res) {
		var name = req.param ('name', null);
		var description = req.param ('description', null);

		projects.create ({
			name: name,
			description: description,
			usersId: req.token.id
		}).then (function (project) {
			// ok
			return res.created(project);
		}).catch (function (err) {
			if (err) {
				console.error(err);
				return res.badRequest(err);
			}
		});
	}
};

