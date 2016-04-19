/* jshint indent: 2 */

module.exports = {
	attributes: {
		userRole: {
			type: Sequelize.ENUM ('host', 'manager', 'tester'),
			allowNull: false
		}
	}
};
