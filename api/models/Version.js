/**
 * Version.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	autoPK: true,
	tableName: "versions",
	attributes: {
		usersId: {model: 'User', via: "usersId"},
		name: {type: 'string', required: true},
		description: {type: 'string'},
		urlSegment: {type: 'string'}
	}
};

