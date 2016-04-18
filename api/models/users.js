/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: true
		},
		updatedAt: {
			type: Sequelize.DATE,
			allowNull: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			primaryKey: true
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	tableName: 'users'
};
