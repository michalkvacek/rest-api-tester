/* jshint indent: 2 */

module.exports = {
	attributes: {
		usersId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'environments',
				key: 'id'
			}
		},
		userRole: {
			type: Sequelize.ENUM ('host', 'manager', 'tester'),
			allowNull: false
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: false
		}
	},
	tableName: 'userBelongsToEnvironment'
};
