/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		projectsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'projects',
				key: 'id'
			}
		},
		tag: {
			type: Sequelize.STRING,
			allowNull: false
		}
	},
	tableName: 'tags'
  
};
