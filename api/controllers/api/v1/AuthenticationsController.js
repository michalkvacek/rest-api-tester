module.exports = {
	index: function (req, res) {
		authentications.findAll ({
			where: {environmentsId: req.environmentId}
		}).then (function (authentications) {
			return res.ok (authentications);
		});
	},

	create: function (req, res) {
		var parameters = {
			environmentsId: req.param ('environmentId'),
			usersId: req.token.id,
			name: req.param ('name'),
			type: req.param ('type'),
			username: req.param ('username'),
			password: req.param ('password'),
			token: req.param ('token'),
			tokenParameter: req.param ('tokenParameter'),
		};

		authentications.create (parameters).then (function (authentication) {
			return res.created (authentication);
		}, function (err) {
			return res.serverError (err);
		});

	},

	delete: function (req, res) {
		authentications.find ({where: {id: req.param ('authId')}}).then (function (authentication) {
			authentication.destroy ();

			return res.ok ('deleted');
		})
	},

	update: function (req, res) {
		authentications.find ({where: {id: req.param ('authId')}}).then (function (authentication) {

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
	},

	detail: function (req, res) {
		authentications.find ({where: {id: req.param ('authId')}}).then (function (authentication) {
			return res.ok (authentication);
		}, function (error) {
			return res.notFound (req.param ('id'));
		});
	},
};