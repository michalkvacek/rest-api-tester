/* jshint indent: 2 */

module.exports = {
	attributes: {
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
		}
	},
	options: {
		tableName: 'projects',
		hooks: {
			afterCreate: function (project, options) {
				environments.create ({
					usersId: project.usersId,
					projectsId: project.id,
					name: 'Development',
					description: "Development environment created as default environemnt",
					apiEndpoint: "http://example.com"
				}).then (function (environment) {
					return environment;
				}).catch (function (err) {
					console.error (err);
				});
			}
		}
	},
	// create relationships with other models
	associations: function () {

		/**
		 * User who created project
		 */
		projects.belongsTo (users, {
			foreignKey: {
				name: 'usersId',
				as: 'author',
				allowNull: false
			}
		});

		/**
		 * Users, who manages this environment
		 */
		projects.hasMany (environments, {
			foreignKey: {
				name: 'projectsId',
				allowNull: false
			}
		});
	}
};


