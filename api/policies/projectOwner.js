module.exports = function (req, res, next) {
	// allow only projects author
	if (typeof req.project == 'undefined' || req.user.id == req.project.usersId)
		return next ();

	return res.forbidden ();
};