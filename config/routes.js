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

	'get /api/v1/projects/:projectId/environments': 'api/v1/Environments.index',
	'get /api/v1/projects': 'api/v1/Projects.index',

	'get /api/v1/tests/statistics': 'api/v1/Tests.statistics',
	'get /api/v1/environments/:environmentId/tests': 'api/v1/Tests.index',
	'get /api/v1/environments/:environmentId/requests': 'api/v1/Requests.index',
	'get /api/v1/requests/:requestId': 'api/v1/Requests.detail',
	'get /api/v1/requests/:requestId/assertions': 'api/v1/Requests.assertions',
	'get /api/v1/requests/:requestId/lastResponse': 'api/v1/Requests.lastResponse',

	'get /api/v1/tests/:testId': 'api/v1/Tests.detail',
	'get /api/v1/assertions/types': 'api/v1/Assertions.types',
	'get /api/v1/assertions/:assertionId': 'api/v1/Assertions.detail',

	'get /api/v1/headers': 'api/v1/Headers.index',
	'get /api/v1/headers/:headerId': 'api/v1/Headers.detail',
	'post /api/v1/headers': 'api/v1/Headers.create',
	'put /api/v1/headers/:headerId': 'api/v1/Headers.update',
	'delete /api/v1/headers/:headerId': 'api/v1/Headers.delete',

	'get /api/v1/requests/:requestId/httpParameters': 'api/v1/HttpParameters.index',
	'get /api/v1/requests/:requestId/httpParameters/:httpParameterId': 'api/v1/HttpParameters.detail',
	'post /api/v1/requests/:requestId/httpParameters': 'api/v1/HttpParameters.create',
	'put /api/v1/requests/:requestId/httpParameters/:httpParameterId': 'api/v1/HttpParameters.update',
	'delete /api/v1/requests/:requestId/httpParameters/:httpParameterId': 'api/v1/HttpParameters.delete',

	// 'get /api/v1/project/:projectId/versions': 'api/v1/Versions.index',
	// 'get /api/v1/project/:projectId/versions/:versionId': 'api/v1/Versions.detail',
	// 'post /api/v1/project/:projectId/versions': 'api/v1/Versions.create',
	// 'put /api/v1/project/:projectId/versions/:versionId': 'api/v1/Versions.update',
	// 'delete /api/v1/project/:projectId/versions/:versionId': 'api/v1/Versions.delete',

	'post /api/v1/registration': 'api/v1/Users.create',
	'post /api/v1/login': "api/v1/Auth.passwordLogin",
	'post /api/v1/projects': 'api/v1/Projects.create',
	'post /api/v1/projects/:projectId/environments': 'api/v1/Environments.create',
	'post /api/v1/environments/:environmentId/tests': 'api/v1/Tests.create',
	'post /api/v1/environments/:environmentId/requests': 'api/v1/Requests.create',

	'post /api/v1/tests/:testId/assignRequests': 'api/v1/Tests.assignRequests',

	'post /api/v1/request/:requestId/assertions': 'api/v1/Assertions.assignToRequest',

	'put /api/v1/requests/:requestId': 'api/v1/Requests.edit',
	'put /api/v1/assertions/:assertionId': 'api/v1/Assertions.update',
	'put /api/v1/tests/:testId': 'api/v1/Tests.update',
	'put /api/v1/tests/:testId/schedule': 'api/v1/Tests.scheduleRun',

	'delete /api/v1/assertions/:assertionId': 'api/v1/Assertions.delete',
};
