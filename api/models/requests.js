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
		},
		versionsId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'versions',
				key: 'id'
			}
		},
		url: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		resourceName: {
			type: Sequelize.STRING,
			allowNull: true
		},
		methodName: {
			type: Sequelize.STRING,
			allowNull: true
		},
		httpMethod: {
			type: Sequelize.STRING,
			allowNull: true
		},
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		lastRunStatus: {
			type: Sequelize.ENUM ('waiting_for_response', 'evaluating', 'failed', 'success'),
			allowNull: true
		}
	},
	options: {
		tableName: 'requests',
		hooks: {
			afterCreate: function (request, options) {
				requestValidatedByAssertions.create ({
					requestsId: request.id,
					assertionType: 'status_code',
					expectedValue: 200,
					comparator: 'eq'
				}).then (function (assertion) {
					// ok
				});
			}
		}
	},
	// create relationships with other models
	associations: function () {

		/**
		 * User who created request
		 */
		requests.belongsTo (users, {
			foreignKey: {
				name: 'usersId',
				as: 'author',
				allowNull: false
			}
		});

		requests.belongsTo (environments, {
			foreignKey: {
				name: 'environmentsId',
				as: 'environment',
				allowNull: false
			}
		});

		requests.belongsTo (versions, {
			foreignKey: {
				name: 'versionsId',
				as: 'version',
				allowNull: true
			}
		});

		requests.belongsTo (authentications, {
			foreignKey: {
				name: 'authenticationsId',
				as: 'auth',
				allowNull: true
			}
		});

		requests.hasMany (headers, {
			foreignKey: {
				name: 'requestsId',
				allowNull: false
			}
		});

		requests.hasMany (httpParameters, {
			foreignKey: {
				name: 'requestsId',
				allowNull: true
			}
		});

		requests.belongsToMany (assertions, {
			through: requestValidatedByAssertions,
			as: 'assertions',
			foreignKey: {
				name: 'requestsId',
				allowNull: false
			}
		});

		/**
		 * Users, who manages this environment
		 */
		requests.belongsToMany (tests, {
			through: requestsInTest,
			as: "tests",
			foreignKey: {
				name: 'requestsId',
				allowNull: false
			}
		});
	}
};
