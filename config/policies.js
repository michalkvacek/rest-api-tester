/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */

module.exports.policies = {
	'*': true,

	'api/v1/Auth': {
		'passwordLogin': true
	},
	'api/v1/Projects': {
		index: ['jwToken'],
		create: ['jwToken'],
		'*': ['jwToken', 'projectIdRequired']
	},
	'api/v1/Users': {
		assignToEnvironment: ['jwToken', 'environmentIdRequired'],
		'*': ['jwToken']
	},
	'api/v1/Environments': {
		index: ['jwToken', 'projectIdRequired'],
		create: ['jwToken', 'projectIdRequired'],
		'*': ['jwToken', 'environmentIdRequired']
	},
	'api/v1/Tests': {
		detail: ['jwToken', 'testIdRequired'],
		update: ['jwToken', 'testIdRequired'],
		scheduleRun: ['jwToken', 'testIdRequired'],
		run: ['jwToken', 'testIdRequired'],
		statistics: ['jwToken'],
		removeRequest: ['jwToken', 'requestIdRequired', 'testIdRequired'],
		addRequest: ['jwToken', 'requestIdRequired', 'testIdRequired'],
		'*': ['jwToken', 'environmentIdRequired']
	},
	'api/v1/Requests': {
		index: ['jwToken', 'environmentIdRequired'],
		create: ['jwToken', 'environmentIdRequired'],
		detail: ['jwToken', 'requestIdRequired'],
		delete: ['jwToken', 'requestIdRequired'],
		edit: ['jwToken', 'requestIdRequired'],
		assertions: ['jwToken', 'requestIdRequired'],
		lastResponse: ['jwToken', 'requestIdRequired'],
		'*': ['jwToken', 'environmentIdRequired']
	},
	'api/v1/Results': {
		'*': ['jwToken']
	},
	'api/v1/HttpParameters': {
		'*': ['jwToken', 'requestIdRequired']
	},
	'api/v1/Assertions': {
		assignToRequest: ['jwToken', 'requestIdRequired'],
		'*': ['jwToken']
	},
	'api/v1/Versions': {
		'*': ['jwToken', 'projectIdRequired']
	},
	'api/v1/Authentications': {
		'*': ['jwToken', 'environmentIdRequired']
	}
}
;
