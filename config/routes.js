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
	'get /projects': 'app/Projects.index',
	'get /projects/:projectId/environments': 'app/Dasboard.index',
	'get /environments/:environmentId/tests': 'app/Tests.index',
	'get /environments/:environmentId/statistics': 'app/Environments.statistics',

	'get /api/v1/projects/:projectId/environments': 'api/v1/Environments.index',
	'get /api/v1/projects': 'api/v1/Projects.index',

	'get /api/v1/environments/:environmentId/statistics': 'api/v1/Environments.statistics',

	'post /api/v1/registration': 'api/v1/Users.create',
	'post /api/v1/login': "api/v1/Auth.passwordLogin",
	'post /api/v1/projects': 'api/v1/Projects.create',
	'post /api/v1/projects/:projectId/environments': 'api/v1/Environments.create',
	'post /api/v1/tests/:environmentId': 'api/v1/Tests.create'
};
