module.exports = {
	index: function (req, res) {
		authentications.findAll ({
			where: {environmentsId: req.environmentId}
		}).then (function (authentications) {
			return res.ok (authentications);
		});
	},

	/**
	 * Create new API authentication
	 *
	 * @param req
	 * @param res
	 */
	create: function (req, res) {
		var parameters = {
			environmentsId: req.param ('environmentId'),
			usersId: req.token.id,
			name: req.param ('name'),
			type: req.param ('type'),
			username: req.param ('username'),
			password: req.param ('password'),
			token: req.param ('token'),
			tokenParameter: req.param ('tokenParameter')
		};

		permissionChecker.canManage (req, res, {
			environmentsId: req.param ('environmentId'),
			roles: ['manager', 'tester']
		}, function () {
			authentications.create (parameters).then (function (authentication) {
				return res.created (authentication);
			}, function (err) {
				return res.serverError (err);
			});
		});
	},

	/**
	 * Delete existing authentication
	 *
	 * @param req
	 * @param res
	 */
	delete: function (req, res) {
		authentications.find ({where: {id: req.param ('authId')}}).then (function (authentication) {
			permissionChecker.canManage (req, res, {
				environmentsId: authentication.environmentsId,
				roles: ['manager', 'tester']
			}, function () {
				authentication.destroy ();

				return res.ok ('deleted');
			})
		})
	},

	/**
	 * Update authentication
	 * @param req
	 * @param res
	 */
	update: function (req, res) {
		authentications.find ({where: {id: req.param ('authId')}}).then (function (authentication) {

			permissionChecker.canManage (req, res, {
				environmentsId: authentication.environmentsId,
				roles: ['manager', 'tester']
			}, function () {
				authentication.update ({
					name: req.param ('name'),
					type: req.param ('type'),
					username: req.param ('username'),
					password: req.param ('password'),
					token: req.param ('token'),
					tokenParameter: req.param ('tokenParameter'),
				}).then (function (edit) {
					return res.ok (authentication);
				}, function (error) {
					return res.notFound (error);
				});
			}, function (error) {
				return res.notFound (error);
			});
		});
	},

	/**
	 * Display details about given authentication
	 *
	 * @param req
	 * @param res
	 */
	detail: function (req, res) {
		authentications.find ({where: {id: req.param ('authId')}}).then (function (authentication) {
			permissionChecker.canManage (req, res, {
				environmentsId: authentication.environmentsId,
			}, function () {
				return res.ok (authentication);
			}, function (error) {
				return res.notFound (req.param ('id'));
			});
		});
	}
};