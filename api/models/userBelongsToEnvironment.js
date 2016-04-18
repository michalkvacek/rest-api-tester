/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define ('userBelongsToEnvironment', {
		usersId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		environmentsId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'environments',
				key: 'id'
			}
		},
		userRole: {
			type: DataTypes.ENUM ('host', 'manager', 'tester'),
			allowNull: false
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'userBelongsToEnvironment'
	});
};
