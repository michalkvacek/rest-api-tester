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
		tableName: 'runnedTests'
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
	}
};
