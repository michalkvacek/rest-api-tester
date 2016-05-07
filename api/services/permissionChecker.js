module.exports = {
	canManage: function (req, res, environmentId) {
		if (typeof environmentId == 'undefined') {
			throw new Error ('set environment, please');
		}

		// current environment does not belong to user in any way
		if (typeof req.managedEnvironments[environmentId] == 'undefined')
			return res.forbidden ();
	},

	verify: function (req, res, allowedRoles, environmentId) {
		permissionChecker.canManage(req, res, environmentId);

		var currentRole = req.managedEnvironments[environmentId];

		// current role was not found in list of all allowed roles
		if (allowedRoles.indexOf (currentRole) < 0)
			return res.forbidden ();
	}
};