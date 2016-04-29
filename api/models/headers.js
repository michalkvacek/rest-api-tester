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
			allowNull: true,
			references: {
				model: 'projects',
				key: 'id'
			}
		},
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'environments',
				key: 'id'
			}
		},
		testsId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'tests',
				key: 'id'
			}
		},
		requestsId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'requests',
				key: 'id'
			}
		},
		name: {
			type: Sequelize.STRING,
			allowNull: true
		},
		value: {
			type: Sequelize.STRING,
			allowNull: true
		}
	},
	options: {
		tableName: 'headers',
		timestamps: false
	},
	associations: function () {
		headers.belongsTo (projects, {
			foreignKey: {
				name: 'projectsId',
				as: 'project',
				allowNull: true
			}
		});

		headers.belongsTo (environments, {
			foreignKey: {
				name: 'environmentsId',
				as: 'environment',
				allowNull: true
			}
		});

		headers.belongsTo (requests, {
			foreignKey: {
				name: 'requestsId',
				as: 'request',
				allowNull: true
			}
		});

	}
};
