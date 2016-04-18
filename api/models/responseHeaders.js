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
		name: {
			type: Sequelize.STRING,
			allowNull: true
		},
		value: {
			type: Sequelize.STRING,
			allowNull: true
		}
	},
	tableName: 'responseHeaders'
};
