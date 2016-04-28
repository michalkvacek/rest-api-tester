/**
 * testIdRequired
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
	var testId = req.param ('testId', false);

	if (!testId)
		return res.badRequest ({error: "Specify testId"});

	tests.findOne({where: {id: testId}}).then(function (test) {
		
		// todo kontrola, zda uzivatel smi videt dany test
		
		if (test == null)
			return res.notFound();

		// define some usefull information
		req.testId = testId;

		return next();
	}).catch (function (err) {
		return res.serverError(err);
	})
};