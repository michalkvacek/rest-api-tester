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
		createdAt: {
			type: Sequelize.DATE,
			allowNull: true
		},
		requestUrl: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		requestQueryString: {
			type: Sequelize.JSON,
			allowNull: true
		},
		requestHttpParameters: {
			type: Sequelize.JSON,
			allowNull: true
		},
		responseTime: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		reponseCode: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		responseSize: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		responseBodyJson: {
			type: Sequelize.JSON,
			allowNull: true
		},
		responseBodyRaw: {
			type: Sequelize.TEXT,
			allowNull: false
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

		responses.belongsTo (environments, {
			foreignKey: {
				name: 'environmentsId',
				as: 'environment',
				allowNull: false
			}
		});
	}
};
