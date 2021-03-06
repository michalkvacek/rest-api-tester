/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 'nextval("testParts_id_seq"::regclass)',
			primaryKey: true
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
		property: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		operator: {
			type: Sequelize.ENUM ('=', '!=', '<', '<=', '>', '=>'),
			allowNull: false
		},
		value: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: true
		}
	},
	tableName: 'requestConditions'
};
