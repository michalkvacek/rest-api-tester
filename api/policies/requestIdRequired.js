/**
 * requestIdRequired
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
	var requestId = req.param ('requestId', false);

	if (!requestId)
		return res.badRequest ({error: "Specify requestId"});

	requests.findOne ({
		where: {id: requestId},
		include: {
			model: environments,
			as: 'environment'
		}
	}).then (function (request) {

		if (request == null) {
			return res.notFound ();
		}

		// define some (hopefully) usefull informations
		req.projectId = request.environment.projectsId;
		req.environmentId = request.environmentsId;
		req.requestId = requestId;
		req.request = request;

		return next ();

	}).catch (function (err) {
		return res.serverError (err);
	})
};