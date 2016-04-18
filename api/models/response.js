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
		responseBodyXml: {
			type: 'XML',
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
	tableName: 'response'
};
