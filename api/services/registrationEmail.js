module.exports = {
	/**
	 * Send password to user
	 *
	 * Maybe move this to the model?
	 *
	 * @param res
	 * @param password
	 * @param user
	 */
	send: function (res, password, user) {
		// try to send email
		sails.hooks.email.send ('registration', {name: user.name, email: user.email, password: password}, {
			to: user.email,
			subject: 'User registration'
		}, function (err) {

			user = user.toJSON();

			// remove password from user's object
			delete user.password;

			if (err)
				return res.serverError (err);

			return res.created (user)
		})
	}
};