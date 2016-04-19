/* jshint indent: 2 */

module.exports = {
	attributes: {
		usersId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		parentTestPartId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'testParts',
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
		environmentsId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'environments',
				key: 'id'
			}
		}
	},
	options: {
		tableName: 'testParts'
	},
	// create relationships with other models
	associations: function () {
		testParts.belongsTo (users, {
			foreignKey: {
				name: 'usersId',
				as: 'author',
				allowNull: false
			}
		});

		testParts.belongsToMany (tests, {
			through: testPartsInTest,
			as: 'testParts',
			foreignKey: {
				name: 'testPartsId',
				allowNull: false
			}
		});
	}
};
