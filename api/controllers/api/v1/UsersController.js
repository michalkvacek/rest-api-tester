/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	 * Registers user and send him email with password
	 *
	 * @param req
	 * @param res
	 */
	create: function (req, res) {
		var userInfo = {
			email: req.param ('email'),
			name: req.param ('name')
		};

		return userService.registerNewUser (res, userInfo);
	},

	/**
	 * Return info about currently logged in user
	 *
	 * @param req
	 * @param res
	 */
	loggedUser: function (req, res) {
		users.find ({where: {id: req.token.id}}).then (function (user) {
			user = user.toJSON ();
			user.roles = req.managedEnvironments;

			delete user.password;

			return res.ok (user);
		});
	},

	/**
	 * Assign existing user or create new user and assign him into some environment
	 *
	 * @param req
	 * @param res
	 * @returns {*}
	 */
	assignToEnvironment: function (req, res) {
		var email = req.param ('email', false);
		var role = req.param ('role', false);

		if (!email)
			return res.badRequest ('no email');

		if (!role)
			return res.badRequest ('no role');

		users.find ({where: {email: email}}).then (function (foundUser) {
			if (!foundUser) {
				// user with given email does not exist, create one

				var name = email.split ('@');

				userService.registerNewUser ({
					email: email,
					name: name[0],
					environmentId: req.environmentId,
					role: role
				}, function (user) {
					user = user.toJSON ();

					// remove password from user's object
					delete user.password;

					return res.created (user);
				});
			} else {
				userService.assignToEnvironment (foundUser.id, req.environmentId, role, function (assignedUser) {
					return res.created (assignedUser);
				}, function (err) {
					// check if user was not inserted again into the same environment

					if (err.name == 'SequelizeUniqueConstraintError')
						return res.badRequest ('user already assigned');

					return res.serverError (err);
				});
			}
		})
	},

	/**
	 * Generate and send new password
	 *
	 * @param req
	 * @param res
	 * @returns {*}
	 */
	forgottenPassword: function (req, res) {
		var email = req.param ('email', false);

		if (!email)
			return res.badRequest ('no email');

		users.find ({where: {email: email}}).then (function (user) {
			if (!user)
				return res.notFound ('invalid user');
			// generate some random password (8 chars long)
			require ('crypto').randomBytes (4, function (err, buffer) {
				user.update ({password: buffer.toString ('hex')}).then (function (updated) {
					return emailSender.forgottenPassword (res, buffer, user);
				})
			});
		});
	},

	/**
	 * Edit logged user and/or change his password
	 *
	 * @param req
	 * @param res
	 */
	edit: function (req, res) {
		users.find ({where: {id: req.token.id}}).then (function (user) {

			var update = {
				name: req.param ('name', ''),
				email: req.param ('email'),
				language: req.param ('language', 'en'),
				notifications: req.param ('notifications', true)
			};

			// if specified, change password
			if (req.param ('password') && req.param ('password') != '') {
				update.password = req.param ('password');
			}

			user.update (update).then (function (updated) {
				updated = updated.toJSON ();

				delete updated.password;

				return res.ok (updated);
			});
		});
	}
};

