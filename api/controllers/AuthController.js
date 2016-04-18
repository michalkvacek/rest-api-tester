/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require ('passport');
var bcrypt = require ('bcryptjs');

module.exports = {
	process: function (req, res) {
		User.findOne ({email: req.param ('email')}).exec (function (err, user) {
		
			// check if user exists or if any error occured
			if (err || !user)
				return res.redirect ('/login');
		
			// check passwords
			if (!bcrypt.compareSync (req.param ('password'), user.password))
				return res.redirect ('/login');
		
			// everything seems to be fine, try to login
			req.logIn (user, function (err) {
				if (err) {
					console.error (err);
					return res.redirect ('/login');
				}
		
				return res.redirect ('/project');
			});
		});
	}
};

