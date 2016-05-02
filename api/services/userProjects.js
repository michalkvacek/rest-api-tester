module.exports = {
	/**
	 * List of all projects, which were created by other user, but user specified as parameter is managing these
	 * projects.
	 *
	 * @param userId
	 * @param callback function used for some action with this data
	 */
	managedByUser: function (userId, callback) {
		if (typeof  callback != "function")
			throw new Error ('Callback not a function');

		projects.findAll ({
			include: [{
				model: environments,
				include: {model: users, as: 'teamMembers', where: {id: userId}}
			}]
		}).then (function (data) {
			// data obtained without error (warning does not matter)
			return callback (null, data);
		}).catch (function (err) {
			// catch errors which may occure
			console.error (err);
			return callback (err, null);
		});
	},

	/**
	 * List of all projects, which were created by specified user
	 *
	 * @param userId
	 * @param callback
	 */
	own: function (userId, callback) {

		if (typeof  callback != "function")
			throw new Error ('Callback not a function');

		projects.findAll ({
			where: {usersId: userId},
			include: [environments]
		}).then (function (data) {
			// data obtained without error (warning does not matter)
			return callback (null, data);
		}).catch (function (err) {
			// catch errors which may occure
			console.error (err);
			return callback (err, null);
		});
	}
};