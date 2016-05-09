module.exports = {
	index: function (req, res) {
		var where = [],
			permissions = {};


		if (req.param ('testId')) {
			where.push ({testsId: req.param ('testId')});
			permissions.testsId = req.param('testId');
		}
		if (req.param ('projectId')) {
			where.push ({projectsId: req.param ('projectId')});
			permissions.projectsId = req.param('projectId');
		}
		if (req.param ('environmentId')) {
			where.push ({environmentsId: req.param ('environmentId')});
			permissions.environmentsId = req.param('environmentId');
		}
		if (req.param ('requestId')) {
			where.push ({requestsId: req.param ('requestId')});
			permissions.requestsId = req.param('requestId');
		}

		if (where.length == 0)
			return res.badRequest ();

		// check permissions
		permissionChecker.canManage (req, res, permissions, function () {
			headers.findAll ({where: {$or: where}}).then (function (headers) {
				return res.ok (headers);
			});
		});
	},

	create: function (req, res) {
		var parameters = {
			projectsId: req.param ('projectsId'),
			environmentsId: req.param ('environmentsId'),
			testsId: req.param ('testsId'),
			requestsId: req.param ('requestsId'),
			name: req.param ('name'),
			value: req.param ('value'),
			roles: ['manager', 'tester']
		};

		permissionChecker.canManage (req, res, parameters, function () {
			delete parameters.roles;
			headers.create (parameters).then (function (header) {
				return res.created (header);
			}, function (err) {
				return res.serverError (err);
			});
		});
	},

	delete: function (req, res) {
		headers.find ({where: {id: req.param ('headerId')}}).then (function (header) {
			var opt = header.toJSON ();
			opt.roles = ['manager', 'tester'];

			// try to delete given header
			permissionChecker.canManage (req, res, opt, function () {
				header.destroy ();

				return res.ok ('deleted');
			});
		});
	},

	update: function (req, res) {
		headers.find ({where: {id: req.param ('id')}}).then (function (header) {

			var opt = header.toJSON ();
			opt.roles = ['manager', 'tester'];
			permissionChecker.canManage (req, res, opt, function () {
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
		});
	},

	detail: function (req, res) {
		headers.find ({where: {id: req.param ('headerId')}}).then (function (header) {
			permissionChecker.canManage (req, res, header, function () {
				return res.ok (header);
			}, function (error) {
				return res.notFound (req.param ('id'));
			});
		});
	}
};