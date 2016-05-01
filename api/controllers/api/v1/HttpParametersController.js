module.exports = {
	index: function (req, res) {
		httpParameters.findAll ({
			where: {requestsId: req.requestId}
		}).then (function (httpParameters) {

			return res.ok (httpParameters);
		});
	},

	create: function (req, res) {
		var parameters = {
			requestsId: req.requestId,
			name: req.param ('name'),
			value: req.param ('value')
		};

		httpParameters.create (parameters).then (function (httpParameter) {
			return res.created (httpParameter);
		}, function (err) {
			return res.serverError (err);
		});

	},

	delete: function (req, res) {
		if (!req.param('httpParameterId')) return res.badRequest();

		httpParameters.find ({where: {id: req.param ('httpParameterId')}}).then (function (httpParameter) {
			httpParameter.destroy ();

			return res.ok ('deleted');
		})
	},

	update: function (req, res) {
		if (!req.param('httpParameterId')) return res.badRequest();

		httpParameters.find ({where: {id: req.param ('httpParameterId')}}).then (function (httpParameter) {

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
	},

	detail: function (req, res) {

		if (!req.param('httpParameterId')) return res.badRequest();

		httpParameters.find ({where: {id: req.param ('httpParameterId')}}).then (function (httpParameter) {
			if (!httpParameter)
				return res.notFound();
			
			return res.ok (httpParameter);
		}, function (error) {
			return res.notFound (req.param ('id'));
		});
	},
};