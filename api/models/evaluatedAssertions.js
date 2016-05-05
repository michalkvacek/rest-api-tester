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
		assertionComparator: {
			type: Sequelize.ENUM ('eq', 'lt', 'gt', 'le', 'ge', 'ne', 'in', 'not_in'),
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
		recievedValue: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		passed: {
			type: Sequelize.BOOLEAN,
			allowNull: false
		}
	},
	options: {
		tableName: 'evaluatedAssertions',
		updatedAt: false
	},
	// create relationships with other models
	associations: function () {

		evaluatedAssertions.belongsTo (responses, {
			foreignKey: {
				name: 'responsesId',
				allowNull: false
			}
		});
	}
};
