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
		parentTestPartId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'testParts',
				key: 'id'
			}
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
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'environments',
				key: 'id'
			}
		}
	},
	tableName: 'testParts'
};
