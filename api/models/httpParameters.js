/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		requestsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'requests',
				key: 'id'
			}
		},
		name: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		value: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	},
	options: {
		tableName: 'httpParameters',
		timestamps: false
	}, 
	associations: function () {
		headers.belongsTo (requests, {
			foreignKey: {
				name: 'requestsId',
				allowNull: true
			}
		});
	}
};
