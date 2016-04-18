/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		usersId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: true
		},
		type: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		content: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		actionLink: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	},
	tableName: 'notifications'
};
