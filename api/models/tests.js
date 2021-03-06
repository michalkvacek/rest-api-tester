/* jshint indent: 2 */

module.exports = {
	attributes: {
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
			type: Sequelize.STRING,
			allowNull: false
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		nextRun: {
			type: Sequelize.DATE,
			allowNull: true
		},
		runInterval: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		lastRun: {
			type: Sequelize.DATE,
			allowNull: true
		},
		lastRunStatus: {
			type: Sequelize.ENUM ('waiting_for_response', 'evaluating', 'failed', 'success'),
			allowNull: true
		}
	},
	options: {
		tableName: 'tests',
	},
	// create relationships with other models
	associations: function () {

		/**
		 * User who created test
		 */
		tests.belongsTo (users, {
			foreignKey: {
				name: 'usersId',
				allowNull: false
			}
		});

		tests.belongsTo (environments, {
			foreignKey: {
				name: 'environmentsId',
				allowNull: false
			}
		});
		
		tests.hasMany (runnedTests, {
			foreignKey: {
				name: 'testsId',
				as: 'results',
				allowNull: false
			}
		});

		tests.hasMany (headers, {
			foreignKey: {
				name: 'testsId',
				allowNull: true
			}
		});

		/**
		 * Users, who manages this environment
		 */
		tests.belongsToMany (requests, {
			through: requestsInTest,
			as: 'requests',
			foreignKey: {
				name: 'testsId',
				allowNull: false
			}
		});
	}
};
