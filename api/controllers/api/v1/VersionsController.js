module.exports = {
	index: function (req, res) {
		versions.findAll ({
			where: {projectsId: req.projectId}
		}).then (function (versions) {

			return res.ok (versions);
		});
	},

	create: function (req, res) {
		permissionChecker.canManage (req, res, {
			projectsId: req.projectId,
			roles: ['manager']
		}, function () {
			var parameters = {
				projectsId: req.projectId,
				usersId: req.token.id,
				name: req.param ('name'),
				description: req.param ('description'),
				urlSegment: req.param ('urlSegment')
			};

			versions.create (parameters).then (function (version) {
				return res.created (version);
			}, function (err) {
				return res.serverError (err);
			});
		});

	},

	delete: function (req, res) {
		versions.find ({where: {id: req.param ('versionId')}}).then (function (version) {
			permissionChecker.canManage (req, res, {
				projectsId: version.projectsId,
				roles: ['manager']
			}, function () {
				version.destroy ();

				return res.ok ('deleted');
			});
		});
	},

	update: function (req, res) {
		versions.find ({where: {id: req.param ('id')}}).then (function (version) {

			permissionChecker.canManage (req, res, {
				projectsId: version.projectsId,
				roles: ['manager']
			}, function () {
				version.update ({
					name: req.param ('name'),
					description: req.param ('description'),
					urlSegment: req.param ('urlSegment')
				}).then (function (edit) {
					return res.ok (version);
				}, function (error) {
					return res.notFound (error);
				});
			}, function (error) {
				return res.notFound (error);
			});
		});
	},

	detail: function (req, res) {
		versions.find ({where: {id: req.param ('versionId')}}).then (function (version) {
			return res.ok (version);
		}, function (error) {
			return res.notFound ();
		});
	}
};