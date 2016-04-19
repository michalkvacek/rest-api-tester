/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {

		users.getOwnProjects (req.user, function (err, ownProjects) {
			users.getManagedProjects (req.user, function (err, managedProjects) {

				return res.view ({
					layout: "noProjectLayout",
					ownProjects: ownProjects,
					managedProjects: managedProjects,
					breadcrumbs: {
						"Homepage": "/",
						'Projects': false
					},
					search: true,
					notifications: true,
					apiAlert: false
				});
			});
		});
	},

	create: function (req, res) {
		var name = req.param ('name', false);
		var description = req.param ('description', null);

		if (!name) {
			return res.redirect ('/project?no-name');
		}

		projects.create ({
			name: name,
			description: description,
			usersId: req.user.id
		}).then (function (project) {
			// ok
			return res.redirect ('/project?ok');
		}).catch (function (err) {
			if (err) {
				console.log (err);

				return res.redirect ('/project?error');
			}
		});
	},
};

