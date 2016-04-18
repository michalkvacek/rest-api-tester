/* jshint indent: 2 */

module.exports = {
	attributes: {
		id_tags: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		id_requests: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'requests',
				key: 'id'
			}
		}
	},
	tableName: 'requestsHaveTags'
};
