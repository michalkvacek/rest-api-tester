/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var crypto = require ('crypto');

module.exports = {

	/**
	 * Registers user and send him email with password
	 *
	 * @param req
	 * @param res
	 */
	postRegistration: function (req, res) {

		// todo check required fields
		// todo check if email is really email

		var email = req.param ('email');
		var username = req.param ('username');

		crypto.randomBytes (4, function (err, buffer) {

			// get random password
			var password = buffer.toString ('hex');

			// create user
			users.create ({name: username, password: password, email: email}).then (function (user) {

				// try to send email
				sails.hooks.email.send ('registration', {username: username, password: password}, {
					to: email,
					subject: 'User registration'
				}, function (err) {

					if (err) {
						console.log (err);
						req.flash ('error', 'nelze odeslat mail s heslem');
						return res.redirect ('/registration');
					}

					req.flash ('success', 'registrace uspesna');
					return res.redirect ('/login');
				})

			}).catch (function (error) {

				req.flash ('error', 'nelze vytvorit uzivatele');
				return res.redirect ('/registration');
			});
		});
	},

	logout: function (req,res){
		req.logout();
		res.send('logout successful');
	},

	/**
	 * `UserController.edit()`
	 */
	postEdit: function (req, res) {
		return res.json ({
			todo: 'edit() is not implemented yet!'
		});
	},

	/**
	 * `UserController.profile()`
	 */
	getProfile: function (req, res) {
		return res.json ({
			todo: 'profile() is not implemented yet!'
		});
	}
};

