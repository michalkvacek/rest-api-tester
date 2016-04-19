/* jshint indent: 2 */

module.exports = {
	attributes: {
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'environments',
				key: 'id'
			}
		},
		usersId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		nextRun: {
			type: Sequelize.DATE,
			allowNull: true
		},
		runInterval: {
			type: 'TINTERVAL',
			allowNull: true
		},
		active: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
			defaultValue: true
		}
	},
	tableName: 'tests'
};
