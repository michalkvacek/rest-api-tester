/* jshint indent: 2 */

module.exports = {
	attributes: {
		apiEndpoint: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		usersId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		projectsId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'projects',
				key: 'id'
			}
		}
	},

	// create relationships with other models
	associations: function () {

		/**
		 * User who created environment
		 */
		environments.belongsTo (users, {
			foreignKey: {
				name: 'usersId',
				allowNull: false
			}
		});

		/**
		 * Users, who manages this environment
		 */

		environments.belongsToMany(users, {
			through: userBelongsToEnvironment,
			as: 'team',
			foreignKey: {
				name: 'environmentsId',
				allowNull: false
			}
		});

		/**
		 * Project, where environment belongs
		 */
		environments.belongsTo (projects, {
			foreignKey: {
				name: "projectsId",
				allowNull: false
			}
		});
	},
	options: {
		tableName: 'environments'
	}
};
