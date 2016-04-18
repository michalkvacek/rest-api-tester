/* jshint indent: 2 */

module.exports = {
	attributes: {
		apiEndpoint: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	},
	tableName: 'environments'
};
