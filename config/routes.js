/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
	'get /': 'app/Homepage.index',

	// API routes

	'delete /api/v1/assertions/:assertionId': 'api/v1/Assertions.delete',
	'delete /api/v1/environments/:environmentId': 'api/v1/Environments.delete',
	'delete /api/v1/environments/:environmentId/auths/:authId': 'api/v1/Authentications.delete',
	'delete /api/v1/environments/:environmentId/users/:userId': 'api/v1/Environments.deleteUser',
	'delete /api/v1/headers/:headerId': 'api/v1/Headers.delete',
	'delete /api/v1/projects/:projectId': 'api/v1/Projects.delete',
	'delete /api/v1/projects/:projectId/versions/:versionId': 'api/v1/Versions.delete',
	'delete /api/v1/requests/:requestId': 'api/v1/Requests.delete',
	'delete /api/v1/requests/:requestId/httpParameters/:httpParameterId': 'api/v1/HttpParameters.delete',
	'delete /api/v1/tests/:testId/requests/:requestId': 'api/v1/Tests.removeRequest',
	'get /api/v1/assertions/types': 'api/v1/Assertions.types',
	'get /api/v1/assertions/:assertionId': 'api/v1/Assertions.detail',
	'get /api/v1/environments/:environmentId': 'api/v1/Environments.detail',
	'get /api/v1/environments/:environmentId/auths': 'api/v1/Authentications.index',
	'get /api/v1/environments/:environmentId/auths/:authId': 'api/v1/Authentications.detail',
	'get /api/v1/environments/:environmentId/requests': 'api/v1/Requests.index',
	'get /api/v1/environments/:environmentId/tests': 'api/v1/Tests.index',
	'get /api/v1/headers': 'api/v1/Headers.index',
	'get /api/v1/headers/:headerId': 'api/v1/Headers.detail',
	'get /api/v1/projects': 'api/v1/Projects.index',
	'get /api/v1/projects/:projectId': 'api/v1/Projects.detail',
	'get /api/v1/projects/:projectId/environments': 'api/v1/Environments.index',
	'get /api/v1/projects/:projectId/versions': 'api/v1/Versions.index',
	'get /api/v1/projects/:projectId/versions/:versionId': 'api/v1/Versions.detail',
	'get /api/v1/requests/:requestId': 'api/v1/Requests.detail',
	'get /api/v1/requests/:requestId/assertions': 'api/v1/Requests.assertions',
	'get /api/v1/requests/:requestId/httpParameters': 'api/v1/HttpParameters.index',
	'get /api/v1/requests/:requestId/httpParameters/:httpParameterId': 'api/v1/HttpParameters.detail',
	'get /api/v1/requests/:requestId/lastResponse': 'api/v1/Requests.lastResponse',
	'get /api/v1/testResults': 'api/v1/Results.overview',
	'get /api/v1/testResults/:testResultId': 'api/v1/Results.detail',
	'get /api/v1/tests/statistics': 'api/v1/Tests.statistics',
	'get /api/v1/tests/:testId': 'api/v1/Tests.detail',
	'get /api/v1/users/me': 'api/v1/Users.loggedUser',

	'post /api/v1/environments/:environmentId/auths': 'api/v1/Authentications.create',
	'post /api/v1/environments/:environmentId/requests': 'api/v1/Requests.create',
	'post /api/v1/environments/:environmentId/runTests': 'api/v1/Environments.runTests',
	'post /api/v1/environments/:environmentId/tests': 'api/v1/Tests.create',
	'post /api/v1/environments/:environmentId/users': 'api/v1/Users.assignToEnvironment',
	'post /api/v1/forgottenPassword': 'api/v1/Users.forgottenPassword',
	'post /api/v1/headers': 'api/v1/Headers.create',
	'post /api/v1/login': "api/v1/Auth.passwordLogin",
	'post /api/v1/projects': 'api/v1/Projects.create',
	'post /api/v1/projects/:projectId/environments': 'api/v1/Environments.create',
	'post /api/v1/projects/:projectId/versions': 'api/v1/Versions.create',
	'post /api/v1/registration': 'api/v1/Users.create',
	'post /api/v1/request/:requestId/assertions': 'api/v1/Assertions.assignToRequest',
	'post /api/v1/requests/:requestId/httpParameters': 'api/v1/HttpParameters.create',
	'post /api/v1/tests/:testId/requests/:requestId': 'api/v1/Tests.addRequest',
	'post /api/v1/tests/:testId/run': 'api/v1/Tests.run',
	
	'put /api/v1/assertions/:assertionId': 'api/v1/Assertions.update',
	'put /api/v1/environments/:environmentId': 'api/v1/Environments.update',
	'put /api/v1/environments/:environmentId/auths/:authId': 'api/v1/Authentications.update',
	'put /api/v1/headers/:headerId': 'api/v1/Headers.update',
	'put /api/v1/projects/:projectId': 'api/v1/Projects.update',
	'put /api/v1/projects/:projectId/versions/:versionId': 'api/v1/Versions.update',
	'put /api/v1/requests/:requestId': 'api/v1/Requests.edit',
	'put /api/v1/requests/:requestId/httpParameters/:httpParameterId': 'api/v1/HttpParameters.update',
	'put /api/v1/tests/:testId': 'api/v1/Tests.update',
	'put /api/v1/tests/:testId/schedule': 'api/v1/Tests.scheduleRun',
	'put /api/v1/users/me': 'api/v1/Users.edit',
};
