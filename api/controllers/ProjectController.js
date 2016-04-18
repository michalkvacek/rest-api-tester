/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {

		Project.getAllUsersProjects (req.user, function (err, projects) {

			console.log(projects);

			return res.view ({
				layout: "noProjectLayout",
				projects: projects,
				breadcrumbs: {
					"Homepage": "/",
					'Projects': false
				},
				search: true,
				notifications: true,
				apiAlert: false
			});
		});
	},

	create: function (req, res) {
		var name = req.param ('name', false);
		var description = req.param ('description', null);

		if (!name) {
			return res.redirect ('/project?no-name');
		}

		Project.create ({
			name: name,
			description: description,
			usersId: req.user.id
		}).exec (function (err, project) {
			if (err) {
				console.log (err);

				return res.redirect ('/project?error');
			}

			// ok
			return res.redirect ('/project?ok');
		});
	},
};

