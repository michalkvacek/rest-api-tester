/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		testsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'tests',
				key: 'id'
			}
		},
		testName: {
			type: Sequelize.STRING,
			allowNull: false
		},
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'environments',
				key: 'id'
			}
		},
		testDescription: {
			type: Sequelize.STRING,
			allowNull: true
		},
		status: {
			type: Sequelize.ENUM ('waiting_for_response', 'evaluating', 'failed', 'success'),
			allowNull: false
		}
	},
	options: {
		tableName: 'runnedTests',
		hooks: {
			afterUpdate: function (runnedTest) {
				tests.find ({where: {id: runnedTest.testsId}}).then (function (test) {

					test.update ({
						lastRunStatus: runnedTest.status,
						lastRun: runnedTest.createdAt
					}).then (function (update) {
						// ok
					})
				})
			}
		}
	},
	// create relationships with other models
	associations: function () {
		runnedTests.belongsTo (tests, {
			foreignKey: {
				name: 'testsId',
				as: 'results',
				allowNull: false
			}
		});

		runnedTests.hasMany (responses, {
			foreignKey: {
				name: 'runnedTestsId',
				allowNull: false
			}
		});
	}
};
