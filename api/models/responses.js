/* jshint indent: 2 */

module.exports = {
	attributes: {

		requestsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'requests',
				key: 'id'
			}
		},
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'environments',
				key: 'id'
			}
		},
		testsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'tests',
				key: 'id'
			}
		},
		runnedTestsId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'runnedTests',
				key: 'id'
			}
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: true
		},
		requestMethod: {
			type: Sequelize.STRING,
			allowNull: false
		},
		requestName: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		requestUrl: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		requestHttpParameters: {
			type: Sequelize.JSON,
			allowNull: true
		},
		responseTime: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		responseCode: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		responseSize: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		requestHeaders: {
			type: Sequelize.JSON,
			allowNull: true
		},
		responseHeaders: {
			type: Sequelize.JSON,
			allowNull: true
		},

		responseBodyRaw: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		passedAssertions: {
			type: Sequelize.BOOLEAN,
			allowNull: true
		},
		status: {
			type: Sequelize.ENUM ('waiting_for_response', 'evaluating', 'failed', 'success'),
			allowNull: false
		}
	},
	options: {
		tableName: 'responses',
		updatedAt: false
	},
	// create relationships with other models
	associations: function () {

		responses.belongsTo (requests, {
			foreignKey: {
				name: 'requestsId',
				as: 'request',
				allowNull: false
			}
		});

		responses.belongsTo (tests, {
			foreignKey: {
				name: 'testsId',
				as: 'test',
				allowNull: false
			}
		});

		responses.belongsTo (environments, {
			foreignKey: {
				name: 'environmentsId',
				as: 'environment',
				allowNull: false
			}
		});

		responses.hasMany (evaluatedAssertions, {
			foreignKey: {
				name: 'responsesId',
				// as: 'assertions',
				allowNull: false
			}
		});
	}
};
