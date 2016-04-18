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
			allowNull: true
		},
		parentTestPartId: {
			type: Sequelize.INTEGER,
			allowNull: true
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
		description: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		versionsId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'versions',
				key: 'id'
			}
		},
		url: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		resourceName: {
			type: Sequelize.STRING,
			allowNull: true
		},
		methodName: {
			type: Sequelize.STRING,
			allowNull: true
		},
		httpMethod: {
			type: Sequelize.STRING,
			allowNull: true
		},
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: true
		}
	},
	tableName: 'requests'
};
