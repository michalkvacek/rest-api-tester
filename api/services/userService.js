module.exports = {
	/**
	 * Create new user with random password
	 *
	 * @param userInfo
	 * @param callback
	 * @param callbackErr
	 */
	registerNewUser: function (userInfo, callback, callbackErr) {
		// get random password (8 char long)
		require ('crypto').randomBytes (4, function (err, buffer) {
			userInfo.password = buffer.toString ('hex');

			var environmentId = userInfo.environmentId;
			delete userInfo.environmentId;

			console.log (userInfo);

			// create user
			users.create (userInfo).then (function (user) {

				if (userInfo.environmentId && userInfo.role) {
					userService.assignToEnvironment (user.id, environmentId, console.log, console.error);
				}

				console.log(typeof callbackErr);


				// send email
				emailSender.registrationEmail (userInfo.password, user, function (err, email) {
					if (err) {
						callbackErr (err);
					} else {
						callback (user);
					}
				});

			}, callbackErr);
		});
	},

	/**
	 * Create new row in userBelongsToEnvironment
	 *
	 * @param userId
	 * @param environmentId
	 * @param role
	 * @param callback
	 * @param callbackErr
	 * @returns {*}
	 */
	assignToEnvironment: function (userId, environmentId, role, callback, callbackErr) {
		userBelongsToEnvironment.create ({
			usersId: userId,
			environmentsId: environmentId,
			userRole: role
		}).then (callback, callbackErr);
	}
}
;