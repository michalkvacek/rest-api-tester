module.exports = {
	/**
	 * Send password to user
	 *
	 * Maybe move this to the model?
	 *
	 * @param password
	 * @param user
	 * @param callback
	 */
	registrationEmail: function (password, user, callback) {
		// try to send email
		sails.hooks.email.send (user.language+'/registration', {name: user.name, email: user.email, password: password}, {
			to: user.email,
			subject: 'Registrace uživatele'
		}, callback)
	},

	/**
	 * Send new password to user's email
	 * 
	 * @param res
	 * @param password
	 * @param user
	 */
	forgottenPassword: function (res, password, user) {
		sails.hooks.email.send (user.language+'/forgottenPassword', {name: user.name, email: user.email, password: password}, {
			to: user.email,
			subject: 'Zapomenuté heslo'
		}, function (err) {
			if (err)
				return res.serverError (err);

			return res.ok ('password changed')
		})
	}
};