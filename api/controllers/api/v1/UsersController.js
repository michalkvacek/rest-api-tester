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

		// get random password (8 char long)
		require('crypto').randomBytes (4, function (err, buffer) {
			userInfo.password = buffer.toString ('hex');

			// create user
			users.create (userInfo)
				.then (function (user) {
					return registrationEmail.send (res, userInfo.password, user)
				}).catch (function (err) {
					return res.badRequest ({errors: err.errors})
				});
		});
	}
};

