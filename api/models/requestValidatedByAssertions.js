/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		requestsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'requests',
				key: 'id'
			}
		},
		assertionsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'assertions',
				key: 'id'
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
	tableName: 'requestValidatedByAssertions'
};
