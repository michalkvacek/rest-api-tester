module.exports = function (req, res, next) {

	if (typeof req.environmentId == 'undefined')
		return next ();

	if (typeof req.managedEnvironments[req.environmentId] == 'undefined')
		return res.forbidden ();

	if (req.managedEnvironments[req.environmentId] != 'tester')
		return res.forbidden ();

	return next ();
};