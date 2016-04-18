/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		requestId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'requests',
				key: 'id'
			}
		},
		name: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		value: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	},
	tableName: 'queryStringParameters'
};
