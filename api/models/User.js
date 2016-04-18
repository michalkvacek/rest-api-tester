/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require ('bcryptjs');

module.exports = {
	tableName: "users",
	autoPK: true,
	autoCreatedBy: false,
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		email: {
			type: 'string',
			required: true
		},
		password: {type: 'string'},
		active: {type: 'boolean'},
		createdProjects: {
			collection: "Project",
			via: "usersId"
		},
		createdEnvironments: {
			collection: 'Environment',
			via: 'usersId'
		},
		managedEnvironments: {
			collection: 'UserBelongsToEnvironment',
			via: 'usersId'
		}
	},

	toJSON: function () {
		var obj = this.toObject ();
		delete obj.password;
		return obj;
	},

	beforeCreate: function (user, callback) {
		bcrypt.genSalt (sails.config.auth.bcrypt.rounds, function (err, salt) {
				bcrypt.hash (user.password, salt, function (err, hash) {
					if (err) {
						return callback (err);
					}

					user.password = hash;
					callback (null, user);
				});
			}
		);
	}
};

