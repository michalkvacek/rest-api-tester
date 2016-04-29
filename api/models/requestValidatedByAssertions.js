/* jshint indent: 2 */

module.exports = {
	attributes: {
		requestsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'requests',
				key: 'id'
			}
		},
		assertionType: {
			type: Sequelize.STRING,
			allowNull: false,
			references: {
				model: 'assertions',
				key: 'type'
			}
		},
		property: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		expectedValue: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	},
	options: {
		tableName: 'requestValidatedByAssertions'
	}
};
