/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
	postRegistration: function (req, res) {

		// todo check required fields
		// todo check if email is really email

		var email = req.param ('email');
		var username = req.param ('username');

		// todo add random password generator
		var password = '123456';

		// todo add email with password

		User.create ({name: username, password: password, email: email}).exec(function(err) {
			if (err) {
				console.error(err);
		
				return res.send('cannot create user');
			}
		
			return res.send('ok');
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

