/**
 * Request.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	autoPK: true,
	tableName: "requests",
	attributes: {
		versionsId: {model: 'Version', via: 'versionsId'},
		environmentsId: {model: 'Environment', via: 'environmentsId'},
		name: {type: 'string'},
		description: {type: 'string'},
		url: {type: 'string', required: true},
		resourceName: {type: 'string'},
		httpMethod: {type: 'string'}
	},
	beforeValidate: function (request, callback) {
		if (typeof  request.name == "undefined" || request.name == '')
			request.name = request.url;

		callback (request);
	}
};

