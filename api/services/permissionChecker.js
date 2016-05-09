module.exports = {
	canManage: function (req, res, options, callback) {

		// can user manage project?
			permissionChecker.getEnvironmentId (options, function (environmentId) {
				if (typeof environmentId == 'undefined') {
					throw new Error ('cannot get environment ID');
				}

				switch (environmentId) {
					case -1:
						return res.notFound ();
						break;
					case -2:
						// lastly try the projects ID
						if (options.projectsId) {
							projects.find ({where: {id: options.projectsId}}).then (function (project) {
								if (project.usersId != req.token.id)
									return res.forbidden ();

								// user is author of this project, so proceed
								callback();
							});
						} else return res.forbidden();
						break;
					default:
						// current environment does not belong to user in any way
						if (typeof req.managedEnvironments[environmentId] == 'undefined') {
							return res.forbidden ();
						} else if (options.roles) {
							var currentRole = req.managedEnvironments[environmentId];

							// current role not found in list of available roles
							if (options.roles.indexOf (currentRole) < 0) {
								return res.forbidden ();
							}

							// role is found and is in list of available roles, proceed
							callback ();
						} else {
							// user can manage current environment and roles are not restricted
							callback ();
						}
						break;
				}
			})
	},

	getEnvironmentId: function (options, callback) {

		console.log(options);

		if (options.environmentsId) {
			callback (options.environmentsId)
		} else if (options.testsId) {
			tests.find ({where: {id: options.testsId}, attributes: ['environmentsId']}).then (function (test) {

				// test not found
				if (test == null)
					callback (-1);

				callback (test.environmentsId);
			});
		} else if (options.requestsId) {
			requests.find ({where: {id: options.requestsId}, attributes: ['environmentsId']}).then (function (request) {

				// test not found
				if (request == null)
					callback (-1);

				callback (request.environmentsId);
			});
		} else {
			callback (-2);
		}
	}
};
