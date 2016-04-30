/* jshint indent: 2 */

module.exports = {
	attributes: {
		type: {
			type: Sequelize.STRING,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		extraCode: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	},
	options: {
		timestamps: false,
		tableName: 'assertions'
	},
	associations: function () {
		assertions.belongsToMany (requests, {
			through: requestValidatedByAssertions,
			as: 'usedInRequests',
			foreignKey: {
				name: 'assertionType',
				allowNull: false
			}
		});

		assertions.hasMany (requestValidatedByAssertions, {
			foreignKey: {
				name: 'assertionType',
				allowNull: false
			}
		});
	}
}
;
