/* jshint indent: 2 */

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
		tableName: 'users'
	},
	associations: function () {
		users.hasMany (environments, {
			foreignKey: {
				name: 'usersId',
				allowNull: false
			}
		});

		users.belongsToMany(environments, {
			through: userBelongsToEnvironment,
			as: 'team',
			foreignKey: {
				name: 'usersId',
				allowNull: false
			}
		});
	}
};
