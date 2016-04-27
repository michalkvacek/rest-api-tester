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
			as: 'author',
			foreignKey: {
				name: 'usersId',
				allowNull: false
			}
		});

		/**
		 * Users, who manage this environment
		 */

		environments.belongsToMany (users, {
			through: userBelongsToEnvironment,
			as: 'teamMembers',
			foreignKey: {
				name: 'environmentsId',
				allowNull: false
			}
		});

		environments.hasMany (tests, {
			as: 'tests',
			foreignKey: {
				name: 'environmentsId',
				allowNull: false
			}
		});

		/**
		 * Project, where environment belongs
		 */
		environments.belongsTo (projects, {
			as: 'project',
			foreignKey: {
				name: "projectsId",
				allowNull: false
			}
		})
		;
	},
	options: {
		tableName: 'environments',
		hooks: {
			afterCreate: function (environment, options) {
				// assign current user to this environment

				userBelongsToEnvironment.create ({
					usersId: environment.usersId,
					environmentsId: environment.id,
					userRole: 'manager'
				}).then (function (err, userInEnv) {
					if (err) console.error (err);
				});
			}
		}
	}
};
