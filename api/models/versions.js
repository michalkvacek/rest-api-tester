/* jshint indent: 2 */

module.exports = {
	attributes: {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		usersId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		projectsId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'projects',
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
		urlSegment: {
			type: Sequelize.STRING,
			allowNull: true
		}
	},
	options: {
		tableName: 'versions'
	},
	// create relationships with other models
	associations: function () {
		versions.hasMany (requests, {
			as: 'requests',
			foreignKey: {
				name: 'versionsId',
				allowNull: true
			}
		});
	}
};
