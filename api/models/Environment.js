/**
 * Environment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	autoPK: true,
	tableName: "environments",
	attributes: {
		apiEndpoint: {type: 'string', required: true},
		name: {type: 'string', required: true},
		projectsId: {type: "integer", required: true},
		description: {type: 'string'},
		usersId: {
			model: "User",
			via: "usersId"
		},
		project: {
			model: "Project",
			via: "projectsId"
		}
	},
	afterCreate: function (environment, callback) {
		UserBelongsToEnvironment.create ({
			usersId: environment.usersId,
			environmentsId: environment.id,
			userRole: 'manager'
		}).exec (function (err, userInEnv) {
			if (err) return callback (err);

			return callback ();
		});
	}
};

