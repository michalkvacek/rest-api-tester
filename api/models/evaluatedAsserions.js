/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		responsesId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'response',
				key: 'id'
			}
		},
		requestsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'requests',
				key: 'id'
			}
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: true
		},
		assertionType: {
			type: Sequelize.STRING,
			allowNull: false
		},
		assertionName: {
			type: Sequelize.STRING,
			allowNull: false
		},
		assertionProperty: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		assertionExpectedValue: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		assertionExtraCode: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		recievedValue: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		passed: {
			type: Sequelize.BOOLEAN,
			allowNull: false
		}
	},
	tableName: 'evaluatedAsserions'
};
