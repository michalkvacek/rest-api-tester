/**
 * environmentIdRequired
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
	var environmentId = req.param ('environmentId', false);

	if (!environmentId)
		return res.badRequest ({error: "Specify environmentId"});

	environments.findOne ({
		where: {id: environmentId},
		include: [{
			model: users,
			as: 'teamMembers',
			where: {id: req.token.id}
		}]
	}).then (function (environment) {

		if (environment == null) {
			return res.notFound ();
		}

		// define some (hopefully) usefull informations
		req.projectId = environment.projectsId;
		req.environmentId = environmentId;
		req.environment = environment;

		return next ();

	}).catch (function (err) {
		console.error (err);
		return res.serverError (err);
	})
};