/* jshint indent: 2 */

var bcrypt = require ('bcrypt');

module.exports = {
	attributes: {
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	options: {
		tableName: 'users',
		hooks: {
			/**
			 * Hash password before creating new user in database
			 *
			 * @param user
			 * @param options
			 * @param next
			 */
			beforeCreate: function (user, options, next) {
				bcrypt.genSalt (8, function (err, salt) {
					if (err)
						return next (err);

					bcrypt.hash (user.password, salt, function (err, hash) {
						if (err)
							return next (err);

						user.password = hash;

						next ();
					})
				})
			}
		}
	},
	associations: function () {
		users.hasMany (environments, {
			foreignKey: {
				name: 'usersId',
				allowNull: false
			}
		});

		users.belongsToMany (environments, {
			through: userBelongsToEnvironment,
			as: 'team',
			foreignKey: {
				name: 'usersId',
				allowNull: false
			}
		});
	}
};
