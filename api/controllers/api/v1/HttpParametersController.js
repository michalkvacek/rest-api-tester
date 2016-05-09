module.exports = {
	index: function (req, res) {
		permissionChecker.canManage (req, res, {requestsId: req.requestId}, function () {
			httpParameters.findAll ({
				where: {requestsId: req.requestId}
			}).then (function (httpParameters) {

				return res.ok (httpParameters);
			});
		});
	},

	create: function (req, res) {
		var parameters = {
			requestsId: req.requestId,
			name: req.param ('name'),
			value: req.param ('value')
		};

		permissionChecker.canManage (req, res, {requestsId: req.requestId, roles: ['manager', 'tester']}, function () {
			httpParameters.create (parameters).then (function (httpParameter) {
				return res.created (httpParameter);
			}, function (err) {
				return res.serverError (err);
			});
		});

	},

	delete: function (req, res) {
		if (!req.param ('httpParameterId'))
			return res.badRequest ();

		httpParameters.find ({where: {id: req.param ('httpParameterId')}}).then (function (httpParameter) {
			permissionChecker.canManage (req, res, {
				requestsId: httpParameter.requestsId,
				roles: ['manager', 'tester']
			}, function () {
				httpParameter.destroy ();

				return res.ok ('deleted');
			})
		})
	},

	update: function (req, res) {
		if (!req.param ('httpParameterId'))
			return res.badRequest ();

		httpParameters.find ({where: {id: req.param ('httpParameterId')}}).then (function (httpParameter) {
			permissionChecker.canManage (req, res, {
				requestsId: httpParameter.requestsId,
				roles: ['manager', 'tester']
			}, function () {
				httpParameter.update ({
					name: req.param ('name'),
					value: req.param ('value')
				}).then (function (edit) {
					return res.ok (httpParameter);
				}, function (error) {
					return res.notFound (error);
				});
			}, function (error) {
				return res.notFound (error);
			});
		});
	}

	,

	detail: function (req, res) {

		if (!req.param ('httpParameterId'))
			return res.badRequest ();

		httpParameters.find ({where: {id: req.param ('httpParameterId')}}).then (function (httpParameter) {
			if (!httpParameter)
				return res.notFound ();

			permissionChecker.canManage (req, res, {
				requestsId: httpParameter.requestsId,
				roles: ['manager', 'tester']
			}, function () {

				return res.ok (httpParameter);
			}, function (error) {
				return res.notFound (req.param ('id'));
			});
		});
	}
	,
};