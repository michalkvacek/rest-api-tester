/**
 * projectIdRequired
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
	var projectId = req.param ('projectId', false);

	if (!projectId)
		return res.badRequest ({error: "Specify projectId"});

	projects.findOne({where: {id: projectId}}).then(function (project) {
		if (project == null)
			return res.notFound();

		// define some usefull information
		req.projectId = projectId;

		return next();
	}).catch (function (err) {
		return res.serverError(err);
	})
};