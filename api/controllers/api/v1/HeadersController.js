module.exports = {
	index: function (req, res) {
		var where = {};

		if (req.param ('testId')) {
			where.push ({testsId: req.param ('testId')});
		}
		if (req.param ('projectId')) {
			where.push ({projectsId: req.param ('projectId')});
		}
		if (req.param ('environmentId')) {
			where.push ({environmentsId: req.param ('environmentId')});
		}
		if (req.param ('requestId')) {
			where.push ({requestsId: req.param ('requestId')});
		}

		if (where.length == 0)
			return res.badRequest ();

		headers.findAll ({
			where: {$or: where}
		}).then (function (headers) {

			return res.ok (headers);
		});
	},

	create: function (req, res) {
		var parameters = {
			projectsId: req.param ('projectId'),
			environmentsId: req.param ('environmentId'),
			testsId: req.param ('testId'),
			requestsId: req.param ('requestId'),
			name: req.param ('name'),
			value: req.param ('value'),
		};

		headers.create (parameters).then (function (header) {
			return res.created (header);
		}, function (err) {
			return res.serverError (err);
		});

	},

	delete: function (req, res) {
		headers.find ({where: {id: req.param ('headerId')}}).then (function (header) {
			header.destroy ();

			return res.ok ('deleted');
		})
	},

	update: function (req, res) {
		headers.find ({where: {id: req.param ('id')}}).then (function (header) {

			header.update ({
				name: req.param ('name'),
				value: req.param ('value')
			}).then (function (edit) {
				return res.ok (header);
			}, function (error) {
				return res.notFound (error);
			});
		}, function (error) {
			return res.notFound (error);
		});
	},

	detail: function (req, res) {
		headers.find ({where: {id: req.param ('headerId')}}).then (function (header) {
			return res.ok (header);
		}, function (error) {
			return res.notFound (req.param ('id'));
		});
	},
};