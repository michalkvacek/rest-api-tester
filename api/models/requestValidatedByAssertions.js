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
		assertionType: {
			type: Sequelize.STRING,
			allowNull: false,
			references: {
				model: 'assertions',
				key: 'type'
			}
		},
		comparator: {
			type: Sequelize.ENUM ('eq', 'lt', 'gt', 'le', 'ge', 'ne', 'in', 'not_in'),
			allowNull: false
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
	},
	// create relationships with other models
	associations: function () {
		requestValidatedByAssertions.belongsTo (assertions, {
			foreignKey: {
				name: 'assertionType',
				allowNull: false
			}
		});
	}
	};
