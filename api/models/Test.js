/**
 * Test.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	autoPK: true,
	tableName: "tests",
	attributes: {
		usersId: {
			model: "User",
			via: "usersId",
			required: true
		},
		environmentsId: {
			model: 'Environment',
			via: "environmentsId",
			required: true
		},
		name: {
			type: 'string',
			required: true
		},
		description: {type: 'string'},
		nextRun: {
			type: 'datetime',
			default: null
		},
		runInterval: {
			type: 'integer',
			default: null
		},
		active: {
			type: 'boolean',
			default: true
		}
	}
};

