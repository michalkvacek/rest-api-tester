/* jshint indent: 2 */

module.exports = {
	attributes: {
		testsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			// references: {
			// 	model: 'tests',
			// 	key: 'id'
			// }
		},
		testPartsId: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			allowNull: false,
			// references: {
			// 	model: 'testParts',
			// 	key: 'id'
			// }
		},
		position: {
			type: Sequelize.INTEGER,
			allowNull: false,
			// defaultValue: '1'
		}
	}
};
