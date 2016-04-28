/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require ('bcryptjs');

module.exports = {
	/**
	 * Method for local login. Requires "email" and "password" parameters.
	 *
	 * Returns token for user.
	 *
	 * @param req
	 * @param res
	 */
	passwordLogin: function (req, res) {
		users.find ({where: {email: req.param ('email')}}).then (function (user) {

			// check if user exists or if any error occured
			if (!user)
				return res.badRequest ('no user');

			// check passwords
			if (!bcrypt.compareSync (req.param ('password'), user.password))
				return res.forbidden ('password');

			// remove password from user model
			user = user.toJSON ();
			delete user.password;

			// user successfully logged in
			res.json ({
				user: user,
				token: jwToken.issue ({id: user.id})
			});
		});
	}
};

