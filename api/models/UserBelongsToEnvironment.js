/**
 * UserBelongsToEnvironment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'userBelongsToEnvironment',
	autoUpdatedAt: false,
	attributes: {
		usersId: {type: 'integer', primaryKey: true},
		environmentsId: {type: 'integer', primaryKey: true},
		userRole: {type: 'string', primaryKey: true}
	}
};

