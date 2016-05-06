/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'environments',
				key: 'id'
			}
		},
		usersId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		name: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		type: {
			type: Sequelize.ENUM ('base', 'bearer'),
			allowNull: false
		},
		password: {
			type: Sequelize.TEXT,
			allowNull: false
		},

		username: {
			type: Sequelize.TEXT,
			allowNull: false
		},

		apiMethod: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		apiParams: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		token: {
			type: Sequelize.TEXT,
			allowNull: true
		},

		tokenProperty: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	},
	options: {
		tableName: 'authentications'
	},
	// create relationships with other models
	associations: function () {

		authentications.belongsTo (users, {
			foreignKey: {
				name: 'usersId',
				allowNull: false
			}
		});

		authentications.belongsTo (environments, {
			foreignKey: {
				name: 'environmentsId',
				allowNull: false
			}
		});

		authentications.hasMany (requests, {
			foreignKey: {
				name: 'authenticationsId',
				allowNull: true
			}
		});
	}
};
